Put these files from Figma in this folder (the sandbox this was built in
could not download from figma.com):

  gym-bg.png            Figma node 13:43 "image 3" -> export the ORIGINAL image.
                        Used by the Sign Up and Registration Details pages.
  fittrack-emblem.svg   Figma node 154:232 "fittrack-emblem" -> Export as SVG.
  payment-qr.png        Figma node 13:166 "image 4" -> export the image.
                        Sample QR for the Registration Details page. In production, pass
                        the real QR from your backend with <RegistrationDetails qrSrc=... />.
                        If this file is missing, a "QR code will appear here"
                        placeholder is shown instead.

All are referenced as /assets/<name> and served from /public, so no import is needed.
