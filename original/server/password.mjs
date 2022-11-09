import util from "node:util";
import crypto from "node:crypto";

const scryptAsync = util.promisify(crypto.scrypt);
const generateKeyAsync = util.promisify(crypto.generateKey);

class Password {
    constructor(password, saltLength = 16) {
        this.password = password;
        this.saltLength = saltLength
    }

    async derive() {
        const salt = (await generateKeyAsync('hmac', { length: this.saltLength * 4 })).export().toString('hex');
        const derivedKey = (await scryptAsync(this.password, salt, 64)).toString('hex');
        return `${salt}${derivedKey}`;
    }

    async verify(storedKey) {
        if (storedKey.length !== 144) {
            return false;
        }

        const salt = storedKey.slice(0, 16);
        const storedDerivedKey = storedKey.slice(16);
        const derivedKey = await scryptAsync(this.password, Buffer.from(salt), 64);
        return derivedKey.toString('hex') === storedDerivedKey;
    }
}

export default Password;