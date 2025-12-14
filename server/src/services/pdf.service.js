const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

/**
 * Generates a PDF itinerary
 * @param {Object} itinerary - AI generated itinerary JSON
 * @returns {string} filePath
 */
function generateItineraryPDF(itinerary) {
    const outputDir = path.join(process.cwd(), 'pdfs');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }

    const fileName = `itinerary-${Date.now()}.pdf`;
    const filePath = path.join(outputDir, fileName);

    const doc = new PDFDocument({ margin: 40 });
    doc.pipe(fs.createWriteStream(filePath));

    // Title
    doc.fontSize(22).text(itinerary.trip_overview?.title || 'Travel Itinerary', {
        align: 'center'
    });
    doc.moveDown();

    // Overview
    if (itinerary.trip_overview?.summary) {
        doc.fontSize(12).text(itinerary.trip_overview.summary);
        doc.moveDown();
    }

    // Day-wise plan
    if (Array.isArray(itinerary.itinerary)) {
        itinerary.itinerary.forEach(day => {
            doc
                .fontSize(16)
                .text(`Day ${day.day}: ${day.title}`, { underline: true });
            doc.moveDown(0.5);

            ['morning', 'afternoon', 'evening'].forEach(time => {
                if (day[time]) {
                    doc.fontSize(12).text(`${time.toUpperCase()}: ${day[time]}`);
                }
            });

            doc.moveDown();
        });
    }

    // Hotels
    if (itinerary.hotels) {
        doc.fontSize(16).text('Hotel Suggestions', { underline: true });
        itinerary.hotels.forEach(h =>
            doc.fontSize(12).text(`- ${h}`)
        );
        doc.moveDown();
    }

    // Budget
    if (itinerary.budget_breakdown) {
        doc.fontSize(16).text('Budget Breakdown', { underline: true });
        Object.entries(itinerary.budget_breakdown).forEach(([k, v]) =>
            doc.fontSize(12).text(`${k}: ${v}`)
        );
        doc.moveDown();
    }

    // Tips
    if (itinerary.tips) {
        doc.fontSize(16).text('Travel Tips', { underline: true });
        itinerary.tips.forEach(t =>
            doc.fontSize(12).text(`- ${t}`)
        );
    }

    doc.end();
    return filePath;
}

module.exports = {
    generateItineraryPDF
};
