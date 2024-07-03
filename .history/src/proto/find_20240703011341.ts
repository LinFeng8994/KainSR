import * as fs from 'fs';

// Định nghĩa kiểu dữ liệu cho các field và message
interface Field {
    type: string;
    name: string;
    index: number;
}

interface Message {
    name: string;
    fields: Field[];
}

// Đọc nội dung tệp proto
const protoFile = 'src/proto/starrail.proto';
const protoContent = fs.readFileSync(protoFile, 'utf-8');

// Tìm message trong nội dung tệp proto
const messageRegex = /message (\w+)\s*{([^}]*)}/g;
const fieldRegex = /(\w+)\s+(\w+)\s*=\s*(\d+);/g;

const messages: Message[] = [];
let match;

// Phân tích cú pháp các message
while ((match = messageRegex.exec(protoContent)) !== null) {
    const messageName = match[1];
    const messageBody = match[2];

    const fields: Field[] = [];
    let fieldMatch;
    while ((fieldMatch = fieldRegex.exec(messageBody)) !== null) {
        const fieldType = fieldMatch[1];
        const fieldName = fieldMatch[2];
        const fieldIndex = parseInt(fieldMatch[3], 10);
        fields.push({ type: fieldType, name: fieldName, index: fieldIndex });
    }

    messages.push({ name: messageName, fields: fields });
}

// Tìm message có field bool với index 12 và repeated uint32 với index 10
const targetMessages = messages.filter(message => {
    const boolField = message.fields.find(field => field.type === 'uint32'&& field.index === 8);
    // const boolField1 = message.fields.find(field =>field.type === 'uint32' && field.index === 5);
    // const boolField2= message.fields.find(field => field.type === 'uint32' &&field.index === 3);
    // const boolField3= message.fields.find(field => field.type === 'uint32' && field.index === 4);
    // const repeatedUint32Field = message.fields.find(field => field.type === 'repeateuint32' && field.index === 10);
    return boolField  && message.fields.length == 1;
});

// In ra các message thỏa mãn điều kiện
console.log('Messages with bool field index 12 and repeated uint32 field index 10:');
targetMessages.forEach(message => {
    console.log(`- ${message.name}`);
});
