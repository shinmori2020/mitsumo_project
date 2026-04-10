// 自社情報管理（LocalStorage）
const COMPANY_KEY = 'mitsumo_company';

const defaultCompany = {
  name: '',
  address: '',
  tel: '',
  email: '',
  url: '',
};

export function getCompanyInfo() {
  try {
    const saved = localStorage.getItem(COMPANY_KEY);
    if (saved) return { ...defaultCompany, ...JSON.parse(saved) };
  } catch {}
  return defaultCompany;
}

export function saveCompanyInfo(info) {
  try {
    localStorage.setItem(COMPANY_KEY, JSON.stringify(info));
  } catch {}
}
