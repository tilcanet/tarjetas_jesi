/**
 * MIXTURAS TILCARA - Lógica para Pantalla de Trabajadores / Mostrador
 * URL Destino: https://mixturas.tilcanet.com.ar
 */

document.addEventListener('DOMContentLoaded', () => {
    const TARGET_URL = 'https://mixturas.tilcanet.com.ar';

    // 1. GENERACIÓN DEL CÓDIGO QR GIGANTE HACIA LA TARJETA PRINCIPAL
    const qrHolder = document.getElementById('staffQrCanvasHolder');
    let qrInstance = null;

    if (qrHolder && typeof QRCode !== 'undefined') {
        qrInstance = new QRCode(qrHolder, {
            text: TARGET_URL,
            width: 250,
            height: 250,
            colorDark: '#0f172a',
            colorLight: '#ffffff',
            correctLevel: 'M'
        });
    }

    // 2. COMPARTIR LINK POR WHATSAPP AL CLIENTE
    const btnShareWhatsApp = document.getElementById('btnShareWhatsApp');
    if (btnShareWhatsApp) {
        btnShareWhatsApp.addEventListener('click', () => {
            const message = `¡Hola! Te comparto la tarjeta digital y datos de Mixturas Tilcara:\n${TARGET_URL}`;
            const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        });
    }

    // 3. COPIAR ENLACE AL PORTAPAPELES
    const btnCopyPageUrl = document.getElementById('btnCopyPageUrl');
    const copyUrlLabel = document.getElementById('copyUrlLabel');
    if (btnCopyPageUrl) {
        btnCopyPageUrl.addEventListener('click', () => {
            navigator.clipboard.writeText(TARGET_URL).then(() => {
                showToast('📋 Enlace copiado: ' + TARGET_URL);
                if (copyUrlLabel) {
                    const originalText = copyUrlLabel.textContent;
                    copyUrlLabel.textContent = '¡Copiado!';
                    setTimeout(() => {
                        copyUrlLabel.textContent = originalText;
                    }, 2000);
                }
            }).catch(() => {
                showToast('No se pudo copiar automáticamente');
            });
        });
    }

    // 4. DESCARGAR QR EN IMAGEN (PNG) PARA IMPRIMIR O GUARDAR
    const btnDownloadStaffQr = document.getElementById('btnDownloadStaffQr');
    if (btnDownloadStaffQr) {
        btnDownloadStaffQr.addEventListener('click', () => {
            const qrCanvas = document.querySelector('#staffQrCanvasHolder canvas');
            if (qrCanvas) {
                const exportCanvas = document.createElement('canvas');
                const padding = 35;
                exportCanvas.width = qrCanvas.width + padding * 2;
                exportCanvas.height = qrCanvas.height + padding * 2 + 75;
                const ctx = exportCanvas.getContext('2d');

                // Fondo blanco redondeado
                ctx.fillStyle = '#ffffff';
                ctx.roundRect ? ctx.roundRect(0, 0, exportCanvas.width, exportCanvas.height, 20) : ctx.rect(0, 0, exportCanvas.width, exportCanvas.height);
                ctx.fill();

                // Dibujar QR
                ctx.drawImage(qrCanvas, padding, padding);

                // Textos de marca abajo
                ctx.fillStyle = '#0f172a';
                ctx.font = 'bold 18px Outfit, sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText('Mixturas Tilcara', exportCanvas.width / 2, exportCanvas.height - 48);

                ctx.fillStyle = '#1d4ed8';
                ctx.font = 'bold 14px Outfit, sans-serif';
                ctx.fillText('mixturas.tilcanet.com.ar', exportCanvas.width / 2, exportCanvas.height - 24);

                const imgUrl = exportCanvas.toDataURL('image/png');
                const a = document.createElement('a');
                a.href = imgUrl;
                a.download = 'QR-Mixturas-Tilcanet.png';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                showToast('🖼️ Imagen del QR descargada');
            } else {
                showToast('Error al procesar QR');
            }
        });
    }

    // 5. MODO PANTALLA COMPLETA
    const btnToggleFullscreen = document.getElementById('btnToggleFullscreen');
    const fullscreenLabel = document.getElementById('fullscreenLabel');
    if (btnToggleFullscreen) {
        btnToggleFullscreen.addEventListener('click', () => {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().then(() => {
                    document.body.classList.add('is-fullscreen-mode');
                    if (fullscreenLabel) fullscreenLabel.textContent = 'Salir Pantalla Completa';
                }).catch(() => {
                    document.body.classList.toggle('is-fullscreen-mode');
                });
            } else {
                document.exitFullscreen().then(() => {
                    document.body.classList.remove('is-fullscreen-mode');
                    if (fullscreenLabel) fullscreenLabel.textContent = 'Pantalla Completa';
                });
            }
        });
    }

    // 6. INSTALACIÓN PWA / ACCESO DIRECTO EN CELULAR
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

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isAndroid = /Android/.test(navigator.userAgent);

    if (isIOS) {
        if (iosInstructions) iosInstructions.style.border = '2px solid #58a9e0';
        if (androidInstructions) androidInstructions.style.opacity = '0.7';
    } else if (isAndroid) {
        if (androidInstructions) androidInstructions.style.border = '2px solid #58a9e0';
        if (iosInstructions) iosInstructions.style.opacity = '0.7';
    }

    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredInstallPrompt = e;
        if (btnNativeInstall) btnNativeInstall.style.display = 'flex';
    });

    window.addEventListener('appinstalled', () => {
        deferredInstallPrompt = null;
        if (btnFloatingInstall) btnFloatingInstall.style.display = 'none';
        showToast('🎉 ¡Acceso directo instalado en tu pantalla!');
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
                deferredInstallPrompt.prompt();
                const { outcome } = await deferredInstallPrompt.userChoice;
                if (outcome === 'accepted') {
                    showToast('📱 Instalando acceso directo en tu celular...');
                }
                deferredInstallPrompt = null;
            } else {
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

    if (btnCloseInstallModal) btnCloseInstallModal.addEventListener('click', closeInstallModal);
    if (btnDismissInstall) btnDismissInstall.addEventListener('click', closeInstallModal);

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

    // 7. TOAST NOTIFICACIÓN
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
});
