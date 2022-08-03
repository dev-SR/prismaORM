import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
	const user = await prisma.user.create({
		data: {
			name: 'Jhon',
			email: 'jhon2@gmail.com',
			age: 25,
			role: 'BASIC',
			writtenPosts: {
				create: [
					{
						title: 'Learn Python',
						averageRating: 0
					},
					{
						title: 'Learn Typescript',
						averageRating: 0
					},
					{
						title: 'Learn Java',
						averageRating: 0
					}
				]
			}
		},
		include: {
			writtenPosts: true
		}
	});
	console.log(user);
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
