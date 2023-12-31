import { prisma } from '../utils/prisma/index.js';

class MenusRepository {
  // 매장 번호 조회
  getStoreId = async (ownerId) => {
    const storeId = await prisma.Store.findMany({
      select: { id: true },
      where: { ownerId: +ownerId },
    });
    return storeId[0].id;
  };

  // 상품 저장
  createMenu = async (storeId, name, description, price, imageUrl) => {
    const createdMenu = await prisma.Menu.create({
      data: {
        name,
        storeId,
        description,
        price: +price,
        imageUrl,
      },
    });
    return createdMenu;
  };

  // 상품 전체 조회
  getMenus = async (storeId, orderBy) => {
    const menus = await prisma.Menu.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        imageUrl: true,
        store: {
          select: {
            owner: {
              select: {
                email: true,
              },
            },
          },
        },
      },
      where: {
        storeId: +storeId,
      },
      orderBy,
    });
    return menus;
  };

  // 상품 상세 조회
  getMenu = async (id) => {
    const menu = await prisma.Menu.findMany({
      select: {
        id: true,
        storeId: true,
        name: true,
        description: true,
        price: true,
        imageUrl: true,
        store: {
          select: {
            owner: {
              select: {
                email: true,
              },
            },
          },
        },
      },
      where: { id: +id },
    });
    return menu;
  };

  // 상품 수정
  updateMenu = async (id, name, description, price, imageUrl) => {
    const menu = await prisma.Menu.update({
      data: {
        name,
        price: +price,
        description,
        imageUrl,
        updatedAt: new Date(),
      },
      where: {
        id: +id,
      },
    });
    return menu;
  };

  // 상품 삭제
  deleteMenu = async (id) => {
    await prisma.Menu.delete({
      where: { id: +id },
    });
  };

  // 업종 전체 조회
  getFoodCategory = async () => {
    const foodCategory = await prisma.FoodCategory.findMany();
    return foodCategory;
  };
}

export default MenusRepository;
