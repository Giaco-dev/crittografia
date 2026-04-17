function shiftChar(char, shift, decrypt = false) {
  const isUpper = char >= 'A' && char <= 'Z';
  const isLower = char >= 'a' && char <= 'z';
  if (!isUpper && !isLower) {
    return char;
  }
  const base = isUpper ? 65 : 97;
  const normalized = char.charCodeAt(0) - base;
  const offset = decrypt ? -shift : shift;
  const rotated = ((normalized + offset) % 26 + 26) % 26;
  return String.fromCharCode(base + rotated);
}

function processText(text, shift, decrypt = false) {
  const normalizedShift = ((shift % 26) + 26) % 26;
  return Array.from(text)
    .map((char) => shiftChar(char, normalizedShift, decrypt))
    .join('');
}

function openModal(modal) {
  modal.classList.add('show');
  modal.setAttribute('aria-hidden', 'false');
}

function closeModal(modal) {
  modal.classList.remove('show');
  modal.setAttribute('aria-hidden', 'true');
}

function setupEncrypt() {
  const form = document.getElementById('encryptForm');
  const modal = document.getElementById('encryptModal');
  const originalField = document.getElementById('originalEncrypt');
  const cipherField = document.getElementById('cipherEncrypt');
  const keyField = document.getElementById('keyEncrypt');
  const closeButton = modal?.querySelector('.close-btn');

  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    const text = document.getElementById('encryptMessage').value;
    const shift = Number(document.getElementById('encryptShift').value);
    const cipherText = processText(text, shift, false);

    originalField.value = text;
    cipherField.value = cipherText;
    keyField.value = shift;
    openModal(modal);

    // Setup copy button after modal opens
    const copyBtn = modal.querySelector('.copy-btn');
    if (copyBtn) {
      copyBtn.onclick = function() {
        const textToCopy = cipherField.value;
        if (textToCopy) {
          navigator.clipboard.writeText(textToCopy).then(function() {
            alert('Messaggio cifrato copiato negli appunti!');
          }).catch(function(err) {
            // Fallback copy method
            const textArea = document.createElement('textarea');
            textArea.value = textToCopy;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
              document.execCommand('copy');
              alert('Messaggio copiato negli appunti!');
            } catch (fallbackErr) {
              alert('Copia fallita. Seleziona e copia manualmente il testo.');
            }
            document.body.removeChild(textArea);
          });
        }
      };
    }

    // Setup delete button
    const deleteBtn = modal.querySelector('.delete-btn');
    if (deleteBtn) {
      deleteBtn.onclick = function() {
        closeModal(modal);
      };
    }
  });

  if (closeButton) {
    closeButton.addEventListener('click', () => closeModal(modal));
  }

  modal?.addEventListener('click', (event) => {
    if (event.target === modal) closeModal(modal);
  });
}

function setupDecrypt() {
  const form = document.getElementById('decryptForm');
  const modal = document.getElementById('decryptModal');
  const originalField = document.getElementById('originalDecrypt');
  const cipherField = document.getElementById('cipherDecrypt');
  const keyField = document.getElementById('keyDecrypt');
  const closeButton = modal?.querySelector('.close-btn');

  if (!form || !modal) {
    return;
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const text = document.getElementById('decryptMessage').value;
    const shift = Number(document.getElementById('decryptShift').value);
    const decryptedText = processText(text, shift, true);

    originalField.value = text;
    cipherField.value = decryptedText;
    keyField.value = shift;
    openModal(modal);

    // Setup copy button after modal opens
    const copyBtn = modal.querySelector('.copy-btn');
    if (copyBtn) {
      copyBtn.onclick = function() {
        const textToCopy = cipherField.value;
        if (textToCopy) {
          navigator.clipboard.writeText(textToCopy).then(function() {
            alert('Messaggio decifrato copiato negli appunti!');
          }).catch(function(err) {
            // Fallback copy method
            const textArea = document.createElement('textarea');
            textArea.value = textToCopy;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
              document.execCommand('copy');
              alert('Messaggio copiato negli appunti!');
            } catch (fallbackErr) {
              alert('Copia fallita. Seleziona e copia manualmente il testo.');
            }
            document.body.removeChild(textArea);
          });
        }
      };
    }

    // Setup delete button
    const deleteBtn = modal.querySelector('.delete-btn');
    if (deleteBtn) {
      deleteBtn.onclick = function() {
        closeModal(modal);
        // Svuota anche i campi del form
        document.getElementById('decryptMessage').value = '';
        document.getElementById('decryptShift').value = '';
      };
    }
  });

  if (closeButton) {
    closeButton.addEventListener('click', () => closeModal(modal));
  }

  modal.addEventListener('click', (event) => {
    if (event.target === modal) closeModal(modal);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // Setup encrypt
  const encryptForm = document.getElementById('encryptForm');
  if (encryptForm) {
    setupEncrypt();
  }
  
  // Setup decrypt
  const decryptForm = document.getElementById('decryptForm');
  if (decryptForm) {
    setupDecrypt();
  }

  // Setup mode menu
  const modeMenuContainer = document.querySelector('.mode-menu-container');
  const modeMenu = document.querySelector('.mode-menu');
  const modeBtn = document.querySelector('.mode-btn');
  
  if (modeMenuContainer && modeMenu && modeBtn) {
    let menuTimeout;
    
    // Check if device is touch-based (mobile/tablet)
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    
    if (!isTouchDevice) {
      // Desktop behavior - hover with delay
      modeMenuContainer.addEventListener('mouseenter', () => {
        clearTimeout(menuTimeout);
        modeMenu.classList.add('open');
      });
      
      modeMenuContainer.addEventListener('mouseleave', () => {
        menuTimeout = setTimeout(() => {
          modeMenu.classList.remove('open');
        }, 3000);
      });
    } else {
      // Mobile behavior - click to toggle
      modeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        modeMenu.classList.toggle('open');
      });
      
      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (!modeMenuContainer.contains(e.target)) {
          modeMenu.classList.remove('open');
        }
      });
      
      // Prevent menu from closing when clicking inside it
      modeMenu.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    }
  }
});
