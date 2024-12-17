document.getElementById('generateBtn').addEventListener('click', async function () {
    const userName = document.getElementById('userName').value;
    //const schoolName = document.getElementById('schoolName').value;
    const loadingDots = document.getElementById('loadingDots');
    const pdfCanvas = document.getElementById('pdfCanvas');

    if (!userName) { // || !schoolName) {
        alert("Please fill in both fields.");
        return;
    }

    loadingDots.style.display = 'block';

    const url = 'SERTIFIKAT.pdf';
    const existingPdfBytes = await fetch(url).then(res => res.arrayBuffer());
    const pdfDoc = await PDFLib.PDFDocument.load(existingPdfBytes);
    const page = pdfDoc.getPages()[0];
    const font = await pdfDoc.embedFont(PDFLib.StandardFonts.Helvetica);
    const fontSize = 24;

    const pageWidth = page.getWidth();

    const userNameWidth = font.widthOfTextAtSize(userName, fontSize);
    //const schoolNameWidth = font.widthOfTextAtSize(schoolName, fontSize);

    const userNameX = (pageWidth - userNameWidth) / 2;
    //const schoolNameX = (pageWidth - schoolNameWidth) / 2;

    page.drawText(userName, {
        x: userNameX,
        y: 330, //340,
        font,
        size: fontSize,
    });

    /*page.drawText(schoolName, {
        x: schoolNameX,
        y: 310,
        font,
        size: fontSize,
    });*/

    const pdfBytes = await pdfDoc.save();
    displayPDFPreview(pdfBytes);

    const downloadBtn = document.getElementById('downloadBtn');
    downloadBtn.style.display = 'inline-block';
    downloadBtn.onclick = function () {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(new Blob([pdfBytes], { type: 'application/pdf' }));
        link.download = 'certificate.pdf';
        link.click();
    };
    loadingDots.style.display = 'none';
});

function displayPDFPreview(pdfBytes) {
    const fileURL = URL.createObjectURL(new Blob([pdfBytes], { type: 'application/pdf' }));
    const loadingDots = document.getElementById('loadingDots');
    const pdfCanvas = document.getElementById('pdfCanvas');
    
    const loadingTask = pdfjsLib.getDocument(fileURL);
    loadingDots.style.display = 'block';
    
    loadingTask.promise.then(function(pdf) {
        pdf.getPage(1).then(function(page) {
            const canvasWidth = 350;
            const canvasHeight = 300;
            const viewport = page.getViewport({ scale: 1 });
            const scaleX = canvasWidth / viewport.width;
            const scaleY = canvasHeight / viewport.height;
            const scale = Math.min(scaleX, scaleY);
            const scaledViewport = page.getViewport({ scale: scale });
            pdfCanvas.width = scaledViewport.width;
            pdfCanvas.height = scaledViewport.height;
            const context = pdfCanvas.getContext('2d');
            const renderContext = {
                canvasContext: context,
                viewport: scaledViewport
            };            
            page.render(renderContext).promise.then(function() {
                loadingDots.style.display = 'none';
                document.getElementById('pdfPreview').style.display = 'block';
            });
        });
    });
}
