
// TEST EDIT
import { ProductRepository } from './repositories/productRepository';
import { SalesRepository } from './repositories/salesRepository';
import { MovementRepository } from './repositories/movementRepository';

export const api = {
  async getProducts() {
    return ProductRepository.getAll();
  },

  async addProduct(product: any) {
    return ProductRepository.add(product);
  },

  async updateProduct(id: number, product: any) {
    return ProductRepository.update(id, product);
  },

  async deleteProduct(id: number) {
    return ProductRepository.delete(id);
  },

  async moveInventory(move: any) {
    // Need to handle stock update and movement record here
    // Reusing existing logic but calling repositories
    // For brevity, I'll implement it inline for now, later refactor
    await MovementRepository.add(move);
    return { success: true };
  },

  async createSale(sale: any) {
    const session = await this.getCurrentSession();
    sale.session_id = session.id;
    return await SalesRepository.createSale(sale);
  },

  async getCurrentReport() {
    const session = await this.getCurrentSession();
    const sales = await SalesRepository.getSalesBySession(session.id);
    const movements = await MovementRepository.getBySession(session.id);
    return { sales, movements, session };
  },

  async getSessionHistory() {
    return SalesRepository.getSessionHistory();
  },

  async closeSession() {
    const session = await this.getCurrentSession();
    await SalesRepository.closeSession(session.id, new Date().toISOString());
    // Create new session
    await SalesRepository.createSession({ start_time: new Date().toISOString() });
    return { success: true };
  },

  async getSessionReport(id: number) {
    const sales = await SalesRepository.getSalesBySession(id);
    const movements = await MovementRepository.getBySession(id);
    return { sales, movements };
  },

  async getCurrentSession() {
    let session = await SalesRepository.getCurrentSession();
    if (!session) {
      session = await SalesRepository.createSession({ start_time: new Date().toISOString() });
    }
    return session;
  }
};
