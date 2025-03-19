
/**
 * Styles for the kitchen menu printing
 */

export const getPageStyle = () => `
  @page {
    size: A4;
    margin: 15mm !important;
  }
  @media print {
    body {
      margin: 0;
      padding: 0;
    }
    * {
      box-sizing: border-box;
      text-align: left;
    }
    h1, h2, h3, h4, h5, h6 {
      text-align: left;
    }
    .print-container {
      width: 210mm;
      height: auto;
      padding: 15mm;
      margin: 0 !important;
      text-align: left;
    }
    h1 {
      font-size: 16px;
      font-weight: normal;
      margin-bottom: 16px;
      text-align: left;
    }
    h2 {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 4px;
      text-align: left;
    }
    h3 {
      font-size: 14px;
      font-weight: normal;
      margin-bottom: 8px;
      text-align: left;
    }
    p {
      font-size: 12px;
      margin: 0;
      margin-bottom: 4px;
      text-align: left;
    }
    hr {
      margin: 16px 0;
      border-color: #ddd;
    }
  }
`;
