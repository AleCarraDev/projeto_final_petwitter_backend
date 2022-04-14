import { prisma } from "../helpers/utils.js";

export const create = async (req, reply) => {
  try {
    const { content } = req.body;
    console.log(typeof req.user.id);
    const petweet = await prisma.petweet.create({
      data: {
        content,
        user: {
          connect: { id: req.user.id },
        },
      },
    });
    return reply.status(201).send(petweet);
  } catch (error) {
    reply.status(500).send({ error: "Deu problema mermão" });
  }
};

export const getAll = async (req, reply) => {
  const { take, skip, page } = req.pagination;
  try {
    const petweetsCount = await prisma.petweet.count();
    const petweets = await prisma.petweet.findMany({
      take,
      skip,
      include: {
        user: {
          select: {
            name: true,
            username: true,
            email: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    console.log(petweets);
    return reply.send({
      petweets,
      pagination: { page, pageCount: Math.ceil(petweetsCount / take) },
    });
  } catch (error) {
    console.log(error);
    reply.status(500).send({ error: "Deu problema mermão" });
  }
};

export const getByID = async (req, reply) => {
  const { id } = req.params;
  const { take, skip, page } = req.pagination;
  try {
    const petweetsCount = await prisma.petweet.count();
    const petweets = await prisma.petweet.findMany({
      take,
      skip,
      where: {
        user_id: Number(id),
      },
      include: {
        user: {
          select: {
            name: true,
            username: true,
            email: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return reply.send({
      petweets,
      pagination: { page, pageCount: Math.ceil(petweetsCount / take) },
    });
  } catch (error) {
    reply.status(500).send({ error: "Deu problema mermão" });
  }
};
