import * as bcrypt from 'bcrypt';

export class PasswordService {

    static hash(password: string) {
        return bcrypt.hashSync(password, parseInt(process.env.Salt ?? "8"));
    }

    static compare(password: string, hash: string) {
        return bcrypt.compareSync(password, hash);
    }
}
