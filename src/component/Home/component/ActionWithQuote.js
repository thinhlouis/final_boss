import quotesAPI from "../../../apis/quotesAPI";

import { useState } from "react";
import Swal from "sweetalert2";

export default function ActionWithQuote() {
  const [text, setText] = useState("");
  const [author, setAuthor] = useState("");
  const [quoteID, setQuoteID] = useState("");
  const [checked, setCheked] = useState(false);

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });

  const handleChangeIdQuote = (e) => {
    setQuoteID(e.target.value);
  };

  const handleAddNewQuote = async () => {
    if (!text) {
      Toast.fire({
        icon: "warning",
        title: "Vui lòng nhập text quote!",
      });
      return;
    }
    const newQuote = {
      text: text,
      author: author,
    };

    try {
      await quotesAPI.addNew(newQuote);
      Toast.fire({
        icon: "success",
        title: "Add new quote success!",
      });
      setText("");
      setAuthor("");
    } catch (error) {
      Toast.fire({
        icon: "error",
        title: error.data.message,
      });
    }
  };

  const handleDeleteQuote = async () => {
    if (!quoteID) {
      Toast.fire({
        icon: "warning",
        title: "Vui lòng nhập ID quote cần xóa!",
      });
      return;
    }
    try {
      await quotesAPI.delete(quoteID);
      Toast.fire({
        icon: "success",
        title: "Remove quote success!",
      });
      setQuoteID("");
    } catch (error) {
      Toast.fire({
        icon: "error",
        title: error.data.message,
      });
    }
  };

  return (
    <div className="action-quote-container">
      <div className="switch-box">
        <h1>SWITCH</h1>
        <label className="switch">
          <input
            type="checkbox"
            checked={checked}
            onChange={() => setCheked(!checked)}
          />
          <span className="slider"></span>
        </label>
      </div>
      {checked ? (
        <div className="delete-quote">
          <h2 style={{ margin: "1.5rem 0", color: "#657e1f" }}>DELETE QUOTE</h2>
          <div className="delete-quote-item">
            <input
              type="text"
              id="delete-quote"
              value={quoteID}
              onChange={handleChangeIdQuote}
              onInput={handleChangeIdQuote}
            />
            <label htmlFor="delete-quote" className="lb-delete">
              ID Quote
            </label>
          </div>
          <div className="delete-quote-item">
            <button className="btn-action-delete" onClick={handleDeleteQuote}>
              DELETE QUOTE
            </button>
          </div>
        </div>
      ) : (
        <div className="add-new-quote">
          <h2 style={{ marginBottom: "1.5rem", color: "#657e1f" }}>
            ADD NEW QUOTE
          </h2>
          <div className="add-new-quote-item">
            <textarea
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              id="quote-text"
            />
            <label htmlFor="quote-text">Text Quote</label>
          </div>
          <div className="add-new-quote-item">
            <label htmlFor="quote-author"></label>
            <select value={author} onChange={(e) => setAuthor(e.target.value)}>
              <option value="" disabled hidden>
                Selected author
              </option>
              <option value="Final Boss">Trùm Cuối</option>
              <option value="Kun Mũm Mĩm">Kun Béo</option>
              <option value="Su Khìn Khìn">Su Khùng</option>
              <option value="Tiin 4 Tuổi">Tiin Hài</option>
              <option value="Miin 2 Tuổi">Miin Tếu</option>
              <option value="Ai Mà Biết">Ko Biết</option>
            </select>
          </div>
          <div className="add-new-quote-item">
            <button className="btn-action-add" onClick={handleAddNewQuote}>
              ADD QUOTE
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
