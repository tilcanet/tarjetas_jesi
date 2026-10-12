/**
 * MIXTURAS TILCARA - Interactive Logic & QR / vCard Engine
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. DATOS DEL CONTACTO (FORMATO VCARD 3.0 ESTÁNDAR)
    const vCardData = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        'N:Tilcara;Mixturas;;;',
        'FN:Mixturas Tilcara',
        'ORG:Mixturas Tilcara - Costura y Tapicería',
        'TITLE:Arreglos de Costura en Gral. y Tapicería',
        'TEL;TYPE=CELL,VOICE,pref:+5493884355880',
        'TEL;TYPE=WORK:+543884355880',
        'ADR;TYPE=WORK;CHARSET=UTF-8:;;Calle 17 de Octubre 479;Tilcara;Jujuy;4622;Argentina',
        'LABEL;TYPE=WORK;CHARSET=UTF-8:Calle 17 de Octubre 479, Barrio Villa Las Rosas, Tilcara, Jujuy',
        'URL;TYPE=WhatsApp:https://wa.me/5493884355880',
        'URL;TYPE=Instagram:https://instagram.com/MixturasTilcara',
        'URL;TYPE=Facebook:https://facebook.com/MixturasTilcara',
        'NOTE;CHARSET=UTF-8:Servicios: Arreglos de costura en general y Tapicería en Tilcara, Jujuy.',
        'END:VCARD'
    ].join('\r\n');

    // 2. REFERENCIAS DE CÓDIGO QR REAL
    // Se utiliza la imagen real de WhatsApp proporcionada en qr what.jpg


    // 3. GIRAR TARJETA 3D INTERACTIVA
    const businessCard = document.getElementById('businessCard');
    const btnFlipCard = document.getElementById('btnFlipCard');

    function toggleFlip() {
        if (businessCard) {
            businessCard.classList.toggle('is-flipped');
        }
    }

    if (businessCard) {
        businessCard.addEventListener('click', (e) => {
            // Evitar que el clic en un enlace de contacto dé vuelta a la tarjeta inmediatamente sin navegar
            if (e.target.closest('a')) return;
            toggleFlip();
        });

        // Accesibilidad con teclado
        businessCard.setAttribute('tabindex', '0');
        businessCard.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleFlip();
            }
        });
    }

    if (btnFlipCard) {
        btnFlipCard.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleFlip();
        });
    }

    // 4. DESCARGA AUTOMÁTICA DE VCARD (.vcf)
    function downloadVCard() {
        try {
            const blob = new Blob([vCardData], { type: 'text/vcard;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'Mixturas-Tilcara.vcf';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            showToast('✅ Descargando contacto a tu agenda...');
        } catch (err) {
            // Fallback con archivo directo existente
            window.location.href = 'contacto-mixturas-tilcara.vcf';
        }
    }

    const btnDownloadVcard = document.getElementById('btnDownloadVcard');
    if (btnDownloadVcard) {
        btnDownloadVcard.addEventListener('click', downloadVCard);
    }

    const btnModalDownloadVcard = document.getElementById('btnModalDownloadVcard');
    if (btnModalDownloadVcard) {
        btnModalDownloadVcard.addEventListener('click', downloadVCard);
    }

    // 5. DESCARGAR QR EN IMAGEN
    const btnDownloadQrImage = document.getElementById('btnDownloadQrImage');
    if (btnDownloadQrImage) {
        btnDownloadQrImage.addEventListener('click', () => {
            const a = document.createElement('a');
            a.href = 'qr what.jpg';
            a.download = 'QR-WhatsApp-Mixturas-Tilcara.jpg';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            showToast('🖼️ Imagen del QR descargada');
        });
    }

    // 6. COPIAR DATOS DE CONTACTO AL PORTAPAPELES
    const btnCopyContactInfo = document.getElementById('btnCopyContactInfo');
    if (btnCopyContactInfo) {
        btnCopyContactInfo.addEventListener('click', () => {
            const infoText = [
                'Mixturas Tilcara',
                'Arreglos de costura en general y Tapicería',
                'Teléfono/WhatsApp: +54 9 388 435-5880 (3884355880)',
                'Dirección: Calle 17 de octubre 479, Barrio Villa las rosas, Tilcara, Jujuy',
                'Instagram: @MixturasTilcara',
                'Facebook: MixturasTilcara'
            ].join('\n');

            navigator.clipboard.writeText(infoText).then(() => {
                showToast('📋 Datos de Mixturas Tilcara copiados al portapapeles');
            }).catch(() => {
                showToast('No se pudo copiar automáticamente');
            });
        });
    }

    // 7. COMPARTIR TARJETA (WEB SHARE API O COPIAR ENLACE)
    const btnShareTop = document.getElementById('btnShareTop');
    if (btnShareTop) {
        btnShareTop.addEventListener('click', () => {
            if (navigator.share) {
                navigator.share({
                    title: 'Mixturas Tilcara | Tarjeta de Contacto',
                    text: 'Te comparto la tarjeta digital de Mixturas Tilcara (Arreglos de costura y tapicería en Tilcara):',
                    url: window.location.href
                }).catch(() => {});
            } else {
                navigator.clipboard.writeText(window.location.href).then(() => {
                    showToast('🔗 Enlace copiado para compartir');
                });
            }
        });
    }

    // 8. MODAL DE QR
    const qrModal = document.getElementById('qrModal');
    const btnOpenQrModal = document.getElementById('btnOpenQrModal');
    const btnCloseModal = document.getElementById('btnCloseModal');

    function openModal() {
        if (qrModal) {
            qrModal.classList.add('is-active');
            qrModal.setAttribute('aria-hidden', 'false');
        }
    }

    function closeModal() {
        if (qrModal) {
            qrModal.classList.remove('is-active');
            qrModal.setAttribute('aria-hidden', 'true');
        }
    }

    if (btnOpenQrModal) {
        btnOpenQrModal.addEventListener('click', openModal);
    }

    if (btnCloseModal) {
        btnCloseModal.addEventListener('click', closeModal);
    }

    if (qrModal) {
        qrModal.addEventListener('click', (e) => {
            if (e.target === qrModal) {
                closeModal();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && qrModal.classList.contains('is-active')) {
                closeModal();
            }
        });
    }

    // 9. SISTEMA TOAST DE NOTIFICACIONES
    let toastTimeout = null;
    function showToast(message) {
        const toast = document.getElementById('toastNotification');
        if (!toast) return;
        toast.textContent = message;
        toast.classList.add('show');

        if (toastTimeout) clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 3200);
    }

    // 10. AÑO AUTOMÁTICO EN EL FOOTER
    const currentYearEl = document.getElementById('currentYear');
    if (currentYearEl) {
        currentYearEl.textContent = new Date().getFullYear();
    }

    // 11. PWA & INSTALACIÓN DE ACCESO DIRECTO EN CELULAR
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('sw.js').catch(() => {});
        });
    }

    let deferredInstallPrompt = null;
    const btnFloatingInstall = document.getElementById('btnFloatingInstall');
    const installModal = document.getElementById('installModal');
    const btnCloseInstallModal = document.getElementById('btnCloseInstallModal');
    const btnDismissInstall = document.getElementById('btnDismissInstall');
    const btnNativeInstall = document.getElementById('btnNativeInstall');
    const iosInstructions = document.getElementById('iosInstructions');
    const androidInstructions = document.getElementById('androidInstructions');

    // Detección de dispositivo
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isAndroid = /Android/.test(navigator.userAgent);

    if (isIOS) {
        if (iosInstructions) iosInstructions.style.border = '2px solid #58a9e0';
        if (androidInstructions) androidInstructions.style.opacity = '0.7';
    } else if (isAndroid) {
        if (androidInstructions) androidInstructions.style.border = '2px solid #58a9e0';
        if (iosInstructions) iosInstructions.style.opacity = '0.7';
    }

    // Evento nativo de instalación en Android / Chromium
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredInstallPrompt = e;
        if (btnNativeInstall) {
            btnNativeInstall.style.display = 'flex';
        }
    });

    window.addEventListener('appinstalled', () => {
        deferredInstallPrompt = null;
        if (btnFloatingInstall) {
            btnFloatingInstall.style.display = 'none';
        }
        showToast('🎉 ¡Acceso directo instalado con éxito en tu pantalla!');
    });

    function openInstallModal() {
        if (installModal) {
            installModal.classList.add('is-active');
            installModal.setAttribute('aria-hidden', 'false');
        }
    }

    function closeInstallModal() {
        if (installModal) {
            installModal.classList.remove('is-active');
            installModal.setAttribute('aria-hidden', 'true');
        }
    }

    if (btnFloatingInstall) {
        btnFloatingInstall.addEventListener('click', async () => {
            if (deferredInstallPrompt) {
                // Si el navegador soporta el diálogo nativo directo:
                deferredInstallPrompt.prompt();
                const { outcome } = await deferredInstallPrompt.userChoice;
                if (outcome === 'accepted') {
                    showToast('📱 Instalando acceso directo en tu celular...');
                }
                deferredInstallPrompt = null;
            } else {
                // Si está en iPhone o necesita guía visual:
                openInstallModal();
            }
        });
    }

    if (btnNativeInstall) {
        btnNativeInstall.addEventListener('click', async () => {
            if (deferredInstallPrompt) {
                deferredInstallPrompt.prompt();
                const { outcome } = await deferredInstallPrompt.userChoice;
                if (outcome === 'accepted') {
                    showToast('📱 Instalando acceso directo...');
                }
                deferredInstallPrompt = null;
                closeInstallModal();
            }
        });
    }

    if (btnCloseInstallModal) {
        btnCloseInstallModal.addEventListener('click', closeInstallModal);
    }

    if (btnDismissInstall) {
        btnDismissInstall.addEventListener('click', closeInstallModal);
    }

    if (installModal) {
        installModal.addEventListener('click', (e) => {
            if (e.target === installModal) closeInstallModal();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && installModal.classList.contains('is-active')) {
                closeInstallModal();
            }
        });
    }
});
