@media print {
  @page {
    margin: 10mm;
    size: A4;
  }

  /* Hide everything first */
  body * {
    visibility: hidden !important;
  }

  /* Only show print container */
  .print-container,
  .print-container * {
    visibility: visible !important;
  }

  /* Position the print container */
  .print-container {
    position: absolute !important;
    left: 0 !important;
    top: 0 !important;
    width: 100% !important;
    background: white !important;
    padding: 10mm !important;
    margin: 0 !important;
    font-size: 12px !important;
    line-height: 1.5 !important;
    color: black !important;
  }

  /* Hide specific elements even inside print container */
  .print-container .print\:hidden,
  .print-container button,
  .flex.justify-end {
    display: none !important;
    visibility: hidden !important;
  }

  /* Header styles - LEFT ALIGNED as requested */
  .print-header {
    text-align: left !important;
    margin-bottom: 1rem !important;
  }

  .print-header h2 {
    font-size: 16px !important;
    font-weight: 600 !important;
    color: black !important;
    margin-bottom: 0.25rem !important;
  }

  .print-header p {
    font-size: 12px !important;
    margin-bottom: 0.75rem !important;
  }

  /* Header divider */
  .print-header:after {
    content: "" !important;
    display: block !important;
    width: 100% !important;
    border-bottom: 0.75px solid #000 !important;
    margin-top: 0.5rem !important;
    margin-bottom: 1rem !important;
  }

  /* Event info styles */
  .event-info-container h1 {
    font-size: 18px !important;
    font-weight: 600 !important;
  }

  /* Section headers - uppercase, bold, 10px */
  .print-container .menu-section-header {
    text-transform: uppercase !important;
    font-weight: bold !important;
    font-size: 10px !important;
    margin-top: 1rem !important;
    margin-bottom: 0.25rem !important;
  }

  /* Add line under section headers */
  .print-container .menu-section-header:after {
    content: "" !important;
    display: block !important;
    width: 100% !important;
    border-bottom: 0.25px solid #000 !important;
    margin-top: 0.25rem !important;
    margin-bottom: 0.5rem !important;
  }

  /* Menu item styles */
  .print-container .menu-item {
    font-size: 12px !important;
    margin-bottom: 0.25rem !important;
  }

  /* Bullet points and list items */
  .print-container ul {
    margin-left: 1.25rem !important;
    padding-left: 0 !important;
    margin-top: 0.25rem !important;
    list-style-type: none !important;
  }

  .print-container li,
  .print-container p:not(.menu-section-header) {
    text-align: left !important;
    break-inside: avoid !important;
    margin-bottom: 0.25rem !important;
    font-size: 12px !important;
  }

  /* Make bullet points that start with "•" look nicer */
  .print-container p {
    text-align: left !important;
  }

  /* Category labels (Meat, Starch, etc.) */
  .print-container .category-label {
    font-weight: 600 !important;
    margin-top: 0.5rem !important;
    margin-bottom: 0.25rem !important;
  }

  /* Notes section */
  .print-container .whitespace-pre-line {
    white-space: pre-line !important;
  }
}
