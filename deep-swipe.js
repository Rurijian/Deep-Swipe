/**
 * Deep Swipe Extension - User Swipe Module
 *
 * Handles swipe generation and navigation for user messages using guided impersonation.
 *
 * @author Rurijian
 * @version 1.2.0
 * @license MIT
 */

import { getContext } from '../../../extensions.js';
import { Generate, eventSource, event_types, cancelDebouncedChatSave, saveChatConditional, stopGeneration } from '../../../../script.js';
import { updateReasoningUI, ReasoningType } from '../../../../scripts/reasoning.js';
import { getSettings, EXTENSION_NAME, DEFAULT_ASSISTANT_PROMPT } from './config.js';
import { syncReasoningFromSwipeInfo, error, isValidMessageId } from './utils.js';
import { updateMessageSwipeUI } from './ui.js';

// Module-level variable to store complete chat backup before generation
let chatBackupBeforeGeneration = null;

/**
 * Get the current API and model information for swipe storage
 */
async function getCurrentApiAndModel() {
    const { getGeneratingApi, getGeneratingModel } = await import('../../../../script.js');
    const api = getGeneratingApi();
    const model = getGeneratingModel() || 'unknown';
    return { api, model };
}

/**
 * Export generateMessageSwipe function
 */
export async function generateMessageSwipe(message, messageId, context, isUserMessage = true) {
    const chat = context.chat;
    const settings = getSettings();
    const currentText = message?.mes || '';
    
    console.log('[Deep Swipe] Starting generation - messageId:', messageId, 'isUserMessage:', isUserMessage);
    
    // CRITICAL FIX: Backup entire chat state at the very beginning
    // This is the ONLY backup we need - complete state before any modifications
    chatBackupBeforeGeneration = JSON.parse(JSON.stringify(chat));
    console.log('[Deep Swipe] Complete chat backup saved, length:', chatBackupBeforeGeneration.length);
    
    // Setup abort handling
    let abortCleanupDone = false;
    let generationAborted = false;
    
    const performAbortCleanup = async () => {
        if (abortCleanupDone) return;
        abortCleanupDone = true;
        
        console.log('[Deep Swipe] STOP - Restoring complete chat from backup');
        
        // Stop server generation
        stopGeneration();
        
        // CRITICAL FIX: Restore ENTIRE chat from backup
        if (chatBackupBeforeGeneration) {
            chat.length = 0;
            chat.push(...JSON.parse(JSON.stringify(chatBackupBeforeGeneration)));
            console.log('[Deep Swipe] Chat restored from backup, length:', chat.length);
        } else {
            console.error('[Deep Swipe] No backup available!');
        }
        
        // Re-render chat
        await context.printMessages();
        
        // Clear backup after successful restore
        chatBackupBeforeGeneration = null;
        
        console.log('[Deep Swipe] Stop cleanup complete');
    };
    
    // Listen for generation stop
    const abortHandler = () => {
        generationAborted = true;
        performAbortCleanup();
    };
    eventSource.once(event_types.GENERATION_STOPPED, abortHandler);
    
    try {
        // Show loading indicator
        const messageElement = document.querySelector(`.mes[mesid="${messageId}"]`);
        if (messageElement) {
            messageElement.classList.add('deep-swipe-loading');
        }
        
        // Cancel any pending saves
        cancelDebouncedChatSave();
        
        // TODO: Add actual swipe generation logic here
        // For now, just simulate a delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        if (generationAborted) {
            console.log('[Deep Swipe] Generation was aborted');
            return;
        }
        
        // Success - clear backup
        chatBackupBeforeGeneration = null;
        
        if (messageElement) {
            messageElement.classList.remove('deep-swipe-loading');
        }
        
        console.log('[Deep Swipe] Generation complete');
        
    } catch (error) {
        console.error('[Deep Swipe] Generation error:', error);
        await performAbortCleanup();
    } finally {
        eventSource.removeListener(event_types.GENERATION_STOPPED, abortHandler);
    }
}

/**
 * Handle navigating back on a user message
 */
export async function handleUserSwipeBack(message, messageId, targetSwipeId, messagesToRestore) {
    const context = getContext();
    const chat = context.chat;
    
    message.swipe_id = targetSwipeId;
    message.mes = message.swipes[targetSwipeId];
    
    if (message.swipe_info?.[targetSwipeId]) {
        syncReasoningFromSwipeInfo(message, targetSwipeId);
    }
    
    await context.printMessages();
}

/**
 * Handle deep swipe back (delete last user message)
 */
export async function dswipeBack(args, messageId) {
    const context = getContext();
    const chat = context.chat;
    
    if (!isValidMessageId(messageId, chat)) {
        error(`Invalid message ID: ${messageId}`);
        return;
    }
    
    const message = chat[messageId];
    
    if (message.is_user) {
        await context.swipe.left(null, {
            source: 'deep-swipe',
            message: message
        });
    } else {
        context.addOneMessage(message, {
            type: 'swipe'
        });
    }
}

/**
 * Handle deep swipe forward (navigate forward)
 */
export async function dswipeForward(args, messageId) {
    const context = getContext();
    const chat = context.chat;
    
    if (!isValidMessageId(messageId, chat)) {
        error(`Invalid message ID: ${messageId}`);
        return;
    }
    
    const message = chat[messageId];
    
    if (message.is_user) {
        if (!message.swipes || message.swipes.length <= 1) {
            await generateMessageSwipe(message, messageId, context, true);
        } else {
            const currentSwipeId = message.swipe_id || 0;
            const nextSwipeId = (currentSwipeId + 1) % message.swipes.length;
            
            if (nextSwipeId === currentSwipeId) {
                await generateMessageSwipe(message, messageId, context, true);
            } else {
                message.swipe_id = nextSwipeId;
                message.mes = message.swipes[nextSwipeId];
                
                if (message.swipe_info?.[nextSwipeId]) {
                    syncReasoningFromSwipeInfo(message, nextSwipeId);
                }
                
                context.addOneMessage(message, {
                    type: 'swipe',
                    forceId: messageId
                });
            }
        }
    } else {
        await context.swipe.right(null, {
            source: 'deep-swipe',
            message: message
        });
    }
}
