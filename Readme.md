# Dyme | Groove on the Go

## Overview
Dyme is a web-based music player that allows users to search for, play, and manage their listening history. The platform features a sleek UI with an intuitive playlist, a play history section, and a search feature to find songs quickly.

## Features
- **Play Music**: Click on any song card to start playing.
- **Play History**: Recently played songs appear at the top of the history list, ensuring no duplicates.
- **Search Functionality**: Find and play songs via an external API.
- **Download Songs**: Users can download the currently playing song directly.
- **Responsive UI**: Works on both desktop and mobile devices.

## File Structure
```
/
├── index.html          # Main webpage structure
├── style.css           # Styles and layout
├── script.js           # Core functionality
├── utils.css           # Utility styles
├── assets/             # Images and icons
└── database/
    └── audios.json     # Sample database of songs
```

## How to Use
1. **Play a Song**: Click the play button on a song card.
2. **View History**: The song appears in the history section without duplicates.
3. **Search a Song**: Use the search bar to find a song.
4. **Download a Song**: Click the download button while a song is playing.

## Dependencies
- FontAwesome (for icons)
- Fetch API (for retrieving songs dynamically)

## Known Issues & Fixes
- **Duplicate song entries in history** → Implemented a check to move an existing song to the top instead of adding duplicates.
- **Search results not updating download button** → Fixed by removing old event listeners before setting a new download link.
- **CORS issues while downloading songs** → Used `fetch()` to retrieve blobs and create an object URL for proper downloads.

## Future Improvements
- **User Authentication**: Allow users to save playlists.
- **Offline Mode**: Cache frequently played songs.
- **Dark Mode**: UI theme toggle.

## Contributions
Feel free to contribute to the project by submitting pull requests or reporting issues.

## License
This project is licensed under the MIT License.

