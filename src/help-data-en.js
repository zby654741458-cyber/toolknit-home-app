export const HELP_CONTENT_EN = {
  'overview': {
    title: 'Overview',
    html: `<div class="help-doc">
      <h2>ToolKnit Overview</h2>
      <p>ToolKnit is a <strong>fully local</strong> multi-functional toolbox desktop app, covering eight tool categories: PDF, Image, Audio, Video, Text, Calculator, Creative, and AI. All file processing is done locally — no uploads to servers.</p>

      <h3>Tool Categories</h3>
      <div class="help-tool-grid">
        <div class="help-tool-card"><div class="help-tool-card-name">PDF Tools</div><div class="help-tool-card-desc">Merge, split, rotate, encrypt, decrypt, compress, text enhance</div></div>
        <div class="help-tool-card"><div class="help-tool-card-name">Image Tools</div><div class="help-tool-card-desc">Format conversion, image compression, icon generator</div></div>
        <div class="help-tool-card"><div class="help-tool-card-name">Audio Tools</div><div class="help-tool-card-desc">Format conversion, BPM detection, clip, trim, merge, extract</div></div>
        <div class="help-tool-card"><div class="help-tool-card-name">Video Tools</div><div class="help-tool-card-desc">Format conversion, compress, trim, GIF, merge</div></div>
        <div class="help-tool-card"><div class="help-tool-card-name">Text Tools</div><div class="help-tool-card-desc">Text diff, character counter, formatter, encoder</div></div>
        <div class="help-tool-card"><div class="help-tool-card-name">Calculator</div><div class="help-tool-card-desc">Scientific calc, unit converter, currency converter, loan calculator</div></div>
        <div class="help-tool-card"><div class="help-tool-card-name">Creative Tools</div><div class="help-tool-card-desc">Color extractor, palette generator, password generator, typing test</div></div>
        <div class="help-tool-card"><div class="help-tool-card-name">AI Tools</div><div class="help-tool-card-desc">AI polish, AI translate, AI doc, AI chat</div></div>
      </div>

      <h3>Key Features</h3>
      <ul>
        <li><strong>100% Local Processing</strong>: All file operations are done on your device — no files uploaded to any server</li>
        <li><strong>Batch Processing</strong>: Support for batch file processing to boost productivity</li>
        <li><strong>Drag & Drop</strong>: Drag files directly onto tool pages for instant processing</li>
        <li><strong>Bilingual Interface</strong>: Supports Chinese and English switching</li>
        <li><strong>Auto Update</strong>: Check for and download new versions online</li>
        <li><strong>FFmpeg Extension</strong>: Audio/video tools automatically download the FFmpeg extension</li>
      </ul>

      <div class="help-note">
        <p>Some tools (such as audio conversion, video conversion) require the FFmpeg extension. You'll be prompted to download it on first use, after which it works offline.</p>
      </div>
    </div>`
  },
  'install': {
    title: 'Install & Launch',
    html: `<div class="help-doc">
      <h2>Install & Launch</h2>

      <h3>System Requirements</h3>
      <ul>
        <li>OS: Windows 10/11 (64-bit)</li>
        <li>RAM: 4GB or more recommended</li>
        <li>Disk Space: At least 200MB (≈300MB with FFmpeg extension)</li>
      </ul>

      <h3>Installation Steps</h3>
      <ol class="help-steps">
        <li>Download the ToolKnit installer (<code>.exe</code> setup program)</li>
        <li>Double-click the installer and choose the installation path</li>
        <li>Wait for installation to complete — a ToolKnit shortcut will appear on your desktop</li>
        <li>Double-click the shortcut to launch the app</li>
      </ol>

      <h3>First Launch</h3>
      <p>On first launch, the app automatically detects your system environment. If you use audio/video tools, you'll be prompted to download the FFmpeg extension (~80-100MB depending on network).</p>

      <div class="help-note">
        <p>The installer automatically selects a download source based on your system language (Chinese users use the domestic source, English users use the international source) for optimal download speed.</p>
      </div>
    </div>`
  },
  'settings': {
    title: 'Settings & Preferences',
    html: `<div class="help-doc">
      <h2>Settings & Preferences</h2>
      <p>Click the <strong>settings icon</strong> at the bottom of the sidebar to open the settings page. Available options:</p>

      <h3>Language Switching</h3>
      <p>Supports <strong>Chinese</strong> and <strong>English</strong>. The interface updates instantly upon switching.</p>

      <h3>Version & Updates</h3>
      <p>Displays the current version number. Click "Check for Updates" to manually detect new versions. If available, the changelog is shown with a download prompt.</p>

      <h3>Default Storage Location</h3>
      <p>Shows the default file save path (usually the ToolKnit folder in your Documents). Click "Open Folder" to quickly access it.</p>

      <h3>Help & Feedback</h3>
      <p>Click "Help Center" to open this help page; click "Feedback" to submit bug reports or suggestions.</p>
    </div>`
  },
  'update': {
    title: 'Version Updates',
    html: `<div class="help-doc">
      <h2>Version Updates</h2>

      <h3>Automatic Update Check</h3>
      <p>ToolKnit automatically checks for new versions on startup. If a new version is found, an update prompt appears showing the new version number and changelog.</p>

      <h3>Manual Update Check</h3>
      <ol class="help-steps">
        <li>Click the <strong>settings icon</strong> at the bottom of the sidebar</li>
        <li>In the "Version & Updates" section, click "Check for Updates"</li>
        <li>If a new version is available, click "Update Now" to start downloading</li>
        <li>After download completes, the app automatically installs and restarts</li>
      </ol>

      <h3>Forced Updates</h3>
      <p>Certain critical versions trigger a forced update — users must update to the latest version to continue using the app, ensuring security and stability.</p>

      <div class="help-note">
        <p>Update downloads use a dual-source strategy: Chinese users download from the domestic source first, English users from the international source, ensuring optimal speed.</p>
      </div>
    </div>`
  },
  'faq-general': {
    title: 'General',
    html: `<div class="help-doc">
      <h2>FAQ - General</h2>

      <div class="help-faq-item">
        <div class="help-faq-q">Q: Is ToolKnit free?</div>
        <div class="help-faq-a">A: Yes, ToolKnit is completely free to use, with no ads or in-app purchases.</div>
      </div>

      <div class="help-faq-item">
        <div class="help-faq-q">Q: Are my files uploaded to a server?</div>
        <div class="help-faq-a">A: No. All file processing is done locally. Files are never uploaded to any server. AI tools only send text content to the AI API for processing.</div>
      </div>

      <div class="help-faq-item">
        <div class="help-faq-q">Q: Which operating systems are supported?</div>
        <div class="help-faq-a">A: Currently supports Windows 10/11 (64-bit). macOS and Linux versions are being planned.</div>
      </div>

      <div class="help-faq-item">
        <div class="help-faq-q">Q: How do I switch languages?</div>
        <div class="help-faq-a">A: Click the settings icon at the bottom of the sidebar, then select Chinese or English in the "Language" section.</div>
      </div>

      <div class="help-faq-item">
        <div class="help-faq-q">Q: Where are my files saved?</div>
        <div class="help-faq-a">A: By default, files are saved in the ToolKnit folder under your Documents. You can view and open the storage location from the settings page.</div>
      </div>

      <div class="help-faq-item">
        <div class="help-faq-q">Q: Is batch processing supported?</div>
        <div class="help-faq-a">A: Yes. Most tools (PDF merge, image conversion, audio conversion, etc.) support batch file processing.</div>
      </div>
    </div>`
  },
  'faq-privacy': {
    title: 'Privacy & Security',
    html: `<div class="help-doc">
      <h2>FAQ - Privacy & Security</h2>

      <div class="help-faq-item">
        <div class="help-faq-q">Q: Are my files safe?</div>
        <div class="help-faq-a">A: Yes. All file processing (PDF, image, audio, video, etc.) is done locally and never uploaded to any server.</div>
      </div>

      <div class="help-faq-item">
        <div class="help-faq-q">Q: Do AI tools save my data?</div>
        <div class="help-faq-a">A: AI tools (polish, translate, chat, etc.) send text content to the AI API for processing, but do not save your input locally.</div>
      </div>

      <div class="help-faq-item">
        <div class="help-faq-q">Q: Is PDF encryption secure?</div>
        <div class="help-faq-a">A: PDF encryption uses industry-standard encryption algorithms. Security depends on password strength. We recommend using passwords of 8+ characters with letters, numbers, and special characters.</div>
      </div>

      <div class="help-faq-item">
        <div class="help-faq-q">Q: Does the app collect usage data?</div>
        <div class="help-faq-a">A: ToolKnit does not collect any user privacy data and contains no tracking code or analytics tools.</div>
      </div>
    </div>`
  },
  'faq-update': {
    title: 'Updates',
    html: `<div class="help-doc">
      <h2>FAQ - Updates</h2>

      <div class="help-faq-item">
        <div class="help-faq-q">Q: How do I check for updates?</div>
        <div class="help-faq-a">A: Go to the settings page and click "Check for Updates" in the "Version & Updates" section. The app also checks automatically on startup.</div>
      </div>

      <div class="help-faq-item">
        <div class="help-faq-q">Q: What if the update download is slow?</div>
        <div class="help-faq-a">A: The app automatically selects the optimal download source based on your system language. If it's still slow, check your network connection or try a different network.</div>
      </div>

      <div class="help-faq-item">
        <div class="help-faq-q">Q: Can I skip a forced update?</div>
        <div class="help-faq-a">A: No. Forced updates typically contain important security fixes or feature improvements — you must update to continue using the app.</div>
      </div>

      <div class="help-faq-item">
        <div class="help-faq-q">Q: What if the update fails?</div>
        <div class="help-faq-a">A: Check your network connection, disable your firewall/antivirus, and try again. If the problem persists, you can manually download the latest installer and install it over the existing version.</div>
      </div>

      <div class="help-faq-item">
        <div class="help-faq-q">Q: Will updating erase my settings?</div>
        <div class="help-faq-a">A: No. Updates only replace application files — user settings and data are not affected.</div>
      </div>
    </div>`
  }
};

export default HELP_CONTENT_EN;
