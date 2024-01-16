import prisma from '@/src/app/prismadb'
import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import { z } from 'zod'
import { SignUpSchema } from '@/ZodSchema/UserSchema'
import nodemailer from 'nodemailer'
import { randomUUID } from 'crypto'
type SignUpSchemaT = z.infer<typeof SignUpSchema>
export async function POST(request: Request) {
    const body: SignUpSchemaT = await request.json()
    if (SignUpSchema.parse(body).success=== false) return NextResponse.json('Data provided is not valid', { status: 500 })
    // const userExist = await prisma.user.findUnique({
    //     where: {
    //         email: body.email
    //     }
    // })
    // if (userExist) return NextResponse.json({
    //     errorMessage: 'Email is associated with another account'
    // })
    const hashPassword = await bcrypt.hash(body.password, 10)
    var transport = nodemailer.createTransport({
        service: 'qq', //使用的邮箱服务，这里qq为例
        port: 465, //邮箱服务端口号
        secure: true, // true for 465, false for other ports
        auth: {
          user: process.env.USER_MAIL, //  邮箱地址
          pass: process.env.USER_PASSWORD //授权码
        },
      })
    try {
        const User = await prisma.user.create({
            data: {
                name: body.username,
                email: body.email,
                password: body.password,

            }
        })
        const verificationtoken = await prisma.activateToken.create({
            data: {
                token: `${randomUUID()}${randomUUID()}`.replace(/-/g, ''),
                userId: User.id
            }
        })
        const options = {
            from: process.env.USER_MAIL,
            to: body.email,
            subject: 'Verify your email',
            html: `<a href="${process.env.NEXT_URL}/api/activate/${verificationtoken.token}">Click here to verify your email</a>`
        }
        transport.verify(function (error, success) {
            if (error) {
                console.log(error);
            } else {
                console.log('Server is good to send email');
            }
        })
        await transport.sendMail(options)
        return NextResponse.json(User)
    } catch (error) {
        return NextResponse.json({ errorMessage: 'Error creating user', error })
    }
}
