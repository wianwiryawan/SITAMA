/* eslint-disable @typescript-eslint/no-explicit-any */
export default function AddTaskModal({ onClose, onSubmit }: any) {
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <form onSubmit={onSubmit}>
        <input name="title" required />
        <select name="priority">
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <button type="button" onClick={onClose}>Batal</button>
        <button type="submit">Simpan</button>
      </form>
    </div>
  );
}