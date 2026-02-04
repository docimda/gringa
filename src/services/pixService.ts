
interface PixParams {
  chave: string;
  nome: string;
  cidade: string;
  valor: number;
  txid?: string;
}

function crc16(payload: string): string {
  let crc = 0xFFFF;

  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      crc = (crc & 0x8000) ? (crc << 1) ^ 0x1021 : crc << 1;
      crc &= 0xFFFF;
    }
  }

  return crc.toString(16).toUpperCase().padStart(4, '0');
}

export const gerarPix = ({ chave, nome, cidade, valor, txid = '***' }: PixParams): string => {
  const valorStr = valor.toFixed(2);
  
  // Helper to format fields: ID + Length + Value
  const f = (id: string, val: string) => {
    const len = val.length.toString().padStart(2, '0');
    return `${id}${len}${val}`;
  };

  const payload = 
    '000201' +
    f('26', `0014BR.GOV.BCB.PIX0114${chave}`) +
    '52040000' +
    '5303986' +
    f('54', valorStr) +
    '5802BR' +
    f('59', nome.slice(0, 25)) + // Max 25 chars
    f('60', cidade.slice(0, 15)) + // Max 15 chars
    f('62', `05${txid.length.toString().padStart(2, '0')}${txid}`) +
    '6304';

  return payload + crc16(payload);
};
