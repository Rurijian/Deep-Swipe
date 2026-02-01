# Deep Swipe

A SillyTavern extension that allows you to swipe (regenerate) any message in your chat history, not just the last one. Clone the native swipe experience for every message!

## Features

- **Swipe any message**: Generate new responses for historical messages
- **Navigate swipes**: Browse through existing swipes with left/right arrows
- **Swipe counters**: See swipe count (e.g., "2/5") on each message
- **Non-destructive**: Uses a truncate-generate-restore pattern that preserves your chat history
- **Multiple UI options**: Choose between simple buttons or full navigation controls

## Installation

1. Copy the `deep-swipe` folder to `public/scripts/extensions/third-party/`
2. Restart SillyTavern or reload extensions
3. The extension will be available immediately

## Usage

### Finding Message IDs

Before using Deep Swipe, you need to know the message ID. Use the built-in `/messages` command:

```
/messages 0-10
```

This will show messages 0-10 with their IDs, content preview, and author.

### Commands

#### `/dswipe back [id]` or `/ds back [id]`
Navigate to the previous swipe on a message.

```
/dswipe back 5
```

#### `/dswipe forward [id]` or `/ds forward [id]`
Generate a new swipe for a message.

```
/dswipe forward 5
```

### UI Controls

Deep Swipe offers two types of UI controls:

#### 1. Generate Button (Rotate Icon)
A simple rotate icon (↻) appears in the message actions menu. Click to generate a new swipe for that message.

#### 2. Swipe Navigation (Arrows + Counter)
Full swipe navigation appears below each message with:
- **Left arrow** (←): Go to previous swipe
- **Counter** (e.g., "2/5"): Shows current swipe position
- **Right arrow** (→): Go to next swipe (or generate new if at last)

**Note:** Both are hidden on the last message (which has native swipe buttons) and on user/system messages.

### Examples

```
# Generate a new response for message #3
/dswipe forward 3

# Navigate to previous swipe on message #7
/dswipe back 7

# Using the short alias
/ds forward 10
```

### Settings

Access the settings in **Extensions > Deep Swipe**:

- **Enable Deep Swipe**: Master toggle for the extension
- **Show generate button on messages**: Simple rotate icon for generating swipes
- **Show swipe navigation (arrows + counter)**: Full navigation with arrows and counter display

You can enable one or both UI options based on your preference!

## Visual Preview

```
[AI Message Text]

    [←]  [2/5]  [→]     ← Swipe Navigation

[Message Actions:  ↻  🗑️  ✏️  ...]  ← Generate Button (↻)
```

## How It Works

Deep Swipe uses a "truncate-generate-restore" pattern:

1. **Save**: Messages after the target are temporarily saved
2. **Truncate**: Chat is truncated to make the target message the last one
3. **Generate**: A new swipe is generated using SillyTavern's existing swipe infrastructure
4. **Restore**: The saved messages are appended back to the chat
5. **Refresh**: The UI is updated to show the new swipe

This approach leverages SillyTavern's proven swipe generation system while extending it to any message in history.

## Limitations

- **Context Window**: The generated response may differ from the original because the AI sees a different context (only messages up to the target)
- **User Messages**: Cannot swipe user messages
- **System Messages**: Cannot swipe system messages or small system messages
- **Last Message**: Deep Swipe UI is hidden on the last message (native swipe buttons exist there)

## Future Enhancements

- [ ] Keyboard shortcuts for quick navigation
- [ ] Visual swipe preview on hover
- [ ] Batch swipe operations
- [ ] Swipe comparison view

## Changelog

### v1.1.0
- Added swipe navigation (left/right arrows) to each message
- Added swipe counter display (e.g., "2/5") to each message
- Separate toggles for generate button vs navigation controls
- Improved CSS styling for navigation elements

### v1.0.0
- Initial release
- Slash commands for back/forward swiping
- Generate button on each message
- Settings UI with enable/disable toggle

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use and modify as needed.

## Credits

Created by Rurijian for the SillyTavern community.
