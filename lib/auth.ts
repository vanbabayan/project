// Импорт библиотеки bcrypt — используется для хеширования и сравнения паролей
import bcrypt from 'bcrypt';

// Импорт библиотеки jsonwebtoken — для создания и проверки JWT токенов
import jwt from 'jsonwebtoken';

// Импорт cookies из Next.js — используется для доступа к куки на сервере
import { cookies } from 'next/headers';

// Импорт экземпляра Prisma-клиента — используется для обращения к базе данных
import prisma from './prisma';
import { CONFIG_FILES } from 'next/dist/shared/lib/constants';

// Секретный ключ, используемый для подписи и проверки JWT токенов
const JW_SECRET = '!@#!@#08123iou';


// Функция для хеширования пароля
export async function hashPassword(password: string){
    const salt = await bcrypt.genSalt(10); // генерирует "соль" с фактором сложности 10
    return bcrypt.hash(password, salt);    // хеширует пароль с использованием соли
}


// Функция для сравнения введённого пароля с хешем из базы данных
export async function comparePassword(password: string, hash: string){
    return bcrypt.compare(password, hash); // возвращает true или false
}


// Функция для создания JWT токена с userId внутри и сроком действия 1 час
export async function signToken(userId: string) {
    return jwt.sign({ userId }, JW_SECRET, { expiresIn: '2h' });
    // payload = { userId }, подпись — JW_SECRET, токен действует 1 час
}


// Функция для проверки валидности токена
export function verifyToken(token: string){
    try {
        return jwt.verify(token, JW_SECRET) as { userId: number };
        // если токен валидный — возвращает объект с userId
    } catch {
        console.log('EEEEEEEEEEEEEEEEEEEEEEEEEEEEE');
        return null; // если токен невалиден или просрочен — возвращает null
    }
}


// Функция для получения текущего пользователя из куки
export async function getCurrentUser(){
    const cookiesStore = await cookies(); // получаем куки из запроса

    console.log(cookiesStore.get('token'));

    const token = cookiesStore.get('token')?.value; // достаём токен из куки
    if (!token) return null; // если токена нет — пользователь не залогинен


    const user = verifyToken(token); // проверяем токен
    if (!user) return null; // если токен невалидный — возвращаем null

    // получаем пользователя из базы данных по userId, который хранится в токене
    return await prisma.user.findUnique({ where: { id: user.userId } });
}
