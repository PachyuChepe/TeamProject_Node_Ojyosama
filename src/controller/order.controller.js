import OrderService from '../service/order.service.js';

class OrderController {
  constructor() {
    this.orderService = new OrderService();
  }

  // 주문 관리 , 조회
  // 업장 1 : 메뉴 N / 메뉴 1 : 주문 N

  // 고객 : 주문 생성 및 저장 post / menuid Int , quantity Int / 고객 1 : 주문 N
  createOrder = async (req, res, next) => {
    try {
      const { menuId, quantity, totalPrice, status } = req.body;
      const customerId = res.locals.user.id; // 인증된 사용자의 ID

      const newOrder = await this.orderService.createOrder(
        menuId,
        customerId,
        quantity,
        totalPrice,
        status,
      );

      res.status(201).json({
        success: true,
        message: '주문이 완료되었습니다.',
        data: newOrder,
      });
    } catch (error) {
      next(error);
    }
  };

  // 사장 : 주문 관리 update / status String : 배달중, 배달완료, 준비중(?)
  updateOrder = async (req, res, next) => {
    try {
      const { orderId } = req.params;
      const { status } = req.body;

      const newOrder = await this.orderService.updateOrder(orderId, status);

      if (newOrder.status === '배달중') {
        res
          .status(200)
          .json({ message: `배달이 시작되었습니다.`, data: newOrder });
      } else if (newOrder.status === '배달완료') {
        res
          .status(200)
          .json({ message: `배달이 완료되었습니다.`, data: newOrder });
      } else if (newOrder.status === '주문취소') {
        res
          .status(200)
          .json({ message: `주문이 취소되었습니다.`, data: newOrder });
      }
    } catch (error) {
      next(error);
    }
  };

  // 사장 : 주문 취소 delete (개인적 사유로 사장의 일방적 취소)
  cancelOrder = async (req, res, next) => {
    try {
      const { orderId } = req.params;

      await this.orderService.cancelOrder(orderId);

      res.status(200).json({ message: '주문을 취소하였습니다.' });
    } catch (error) {
      next(error);
    }
  };

  // 사장 : 주문 전체 조회 (우선)
  getStoreOrders = async (req, res, next) => {
    try {
      const { storeId } = req.params;
      const orders = await this.orderService.getStoreOrders(storeId);

      res.status(200).json({
        success: true,
        message: '전체 주문 조회에 성공하였습니다.',
        data: orders,
      });
    } catch (error) {
      next(error);
    }
  };

  // 고객 : 주문 전체 조회 (우선)
  getUserOrders = async (req, res, next) => {
    try {
      const customerId = res.locals.user.id;
      const orders = await this.orderService.getUserOrders(customerId);

      res.status(200).json({
        success: true,
        message: '전체 주문 조회에 성공하였습니다.',
        data: orders,
      });
    } catch (error) {
      next(error);
    }
  };

  // 공통? 사장? : 주문 상세 조회
  getOrder = async (req, res, next) => {
    try {
      const { orderId } = req.params;

      const order = await this.orderService.getOrder(orderId, res);

      return res.status(200).json({
        success: true,
        message: '주문 상세 조회에 성공하였습니다.',
        data: order,
      });
    } catch (error) {
      next(error);
    }
  };

  // 업장 1 : 메뉴 N / 메뉴 1 : 주문 N

  // 공통 : 주문 전체 조회와, 주문 상세 조회
  // {
  //     "success": "Boolean",
  //     "orders": [
  //     {
  //     "id": "Integer",
  //     "customerId": "Integer",
  //     "menuId": "Integer",
  //     "quantity": "Integer",
  //     "total_price": "String",
  //     "status": "String",
  //     "created_at": "Timestamp"
  //     },
  //     ...
  //     ]
  //     }
}

export default OrderController;
