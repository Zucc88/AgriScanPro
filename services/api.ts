
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw98-416Jry8wCsJsfc-xN82cNh09R5ULXWG3urKcT3E-X4gFbxIUFNZdLIugIIJKsq/exec';
const API_KEY = 'AGRISCAN_2026_PRO_SECURE';

export const fetchAllData = async (): Promise<any[]> => {
  const response = await fetch(`${SCRIPT_URL}?action=readAll&key=${API_KEY}`);
  const result = await response.json();
  return result;
};

export const cleanupOldData = async (): Promise<void> => {
  try {
    // Chiamata per pulizia vecchi record con chiave di sicurezza
    await fetch(`${SCRIPT_URL}?action=cleanupOld&key=${API_KEY}`);
  } catch (error) {
    console.warn("Pulizia automatica non riuscita, procedo comunque.", error);
  }
};

export const markRowAsChecked = async (rowIndex: number): Promise<boolean> => {
  try {
    const response = await fetch(`${SCRIPT_URL}?action=markCheck&row=${rowIndex}&key=${API_KEY}`);
    const text = await response.text();
    
    try {
      const result = JSON.parse(text);
      return result.status === 'success' || text.includes("OK");
    } catch {
      return text.trim().toUpperCase() === "OK" || text.toLowerCase().includes("success");
    }
  } catch (error) {
    console.error('Error marking row:', error);
    return false;
  }
};

export const deleteCheckedRows = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${SCRIPT_URL}?action=deleteChecked&key=${API_KEY}`);
    const text = await response.text();
    
    try {
      const result = JSON.parse(text);
      return result.status === 'success' || text.includes("OK");
    } catch {
      return text.trim().toUpperCase() === "OK" || text.toLowerCase().includes("success");
    }
  } catch (error) {
    console.error('Error deleting rows:', error);
    return false;
  }
};
