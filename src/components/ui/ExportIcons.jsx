// 出力ボタン用SVGアイコン
const iconStyle = { width: 20, height: 20, fill: 'currentColor' };

export function ExcelIcon() {
  return (
    <svg viewBox="0 0 24 24" style={iconStyle}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM14 3.5L18.5 8H14V3.5zM8 17l2.5-4L8 9h2l1.5 2.5L13 9h2l-2.5 4L15 17h-2l-1.5-2.5L10 17H8z"/>
    </svg>
  );
}

export function PdfIcon() {
  return (
    <svg viewBox="0 0 24 24" style={iconStyle}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM14 3.5L18.5 8H14V3.5zM10.5 11c.83 0 1.5.67 1.5 1.5v1c0 .83-.67 1.5-1.5 1.5H9v2H7.5V11h3zm4 0c.83 0 1.5.67 1.5 1.5v3c0 .83-.67 1.5-1.5 1.5H13V11h1.5zM9 12.5v1h1.5v-1H9zm5.5 0v3H16v-3h-1.5z"/>
    </svg>
  );
}

export function CopyIcon() {
  return (
    <svg viewBox="0 0 24 24" style={iconStyle}>
      <path d="M16 1H4a2 2 0 0 0-2 2v14h2V3h12V1zm3 4H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm0 16H8V7h11v14z"/>
    </svg>
  );
}

export function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" style={iconStyle}>
      <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
    </svg>
  );
}

export function LinkIcon() {
  return (
    <svg viewBox="0 0 24 24" style={iconStyle}>
      <path d="M3.9 12a4.1 4.1 0 0 1 4.1-4.1H11V6H8a6 6 0 0 0 0 12h3v-1.9H8A4.1 4.1 0 0 1 3.9 12zM8 13h8v-2H8v2zm5-7h3a6 6 0 0 1 0 12h-3v-1.9h3a4.1 4.1 0 0 0 0-8.2h-3V6z"/>
    </svg>
  );
}

export function SaveIcon() {
  return (
    <svg viewBox="0 0 24 24" style={iconStyle}>
      <path d="M17 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7l-4-4zm-5 16a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm3-10H5V5h10v4z"/>
    </svg>
  );
}

export function CompareIcon() {
  return (
    <svg viewBox="0 0 24 24" style={iconStyle}>
      <path d="M10 3H4a1 1 0 0 0-1 1v7h2V5h4V3zm0 18H4a1 1 0 0 1-1-1v-7h2v6h4v2zM20 3h-6v2h4v5h2V4a1 1 0 0 0-1-1zm0 18h-6v-2h4v-6h2v7a1 1 0 0 1-1 1zM14 9h-4v2h4V9zm0 4h-4v2h4v-2z"/>
    </svg>
  );
}
