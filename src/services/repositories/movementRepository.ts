import { dbService } from '../database';

export const MovementRepository = {
  async add(movement: any) {
    await dbService.run(
      'INSERT INTO movements (product_id, product_name, type, quantity, reason, session_id, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [movement.product_id, movement.product_name, movement.type, movement.quantity, movement.reason, movement.session_id, movement.timestamp]
    );
  },

  async getBySession(sessionId: number) {
    const result = await dbService.query('SELECT * FROM movements WHERE session_id = ?', [sessionId]);
    return result.values || [];
  }
};
