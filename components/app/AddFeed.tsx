import Modal from "react-modal";
import { useState } from "react";

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

/**
 * フィード登録用のモーダル、登録処理を扱う
 * @constructor
 */
export default function AddFeed() {
  const [feedUrl, setFeedUrl] = useState("");

  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => {
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
  };
  const addFeed = async () => {
    console.log(`feedUrl=${feedUrl}`);
    // `https://a.jp` is 13 characters
    if (!feedUrl || feedUrl.length < 13) {
      return window.alert('URLが正しくありません。');
    }

    const result = await (await fetch(`/api/feeds/create`, {
      method: 'POST',
      body: JSON.stringify({feedUrl: feedUrl}),
      headers: {
        'Content-Type': 'application/json',
      }
    })).json();
    console.log(result);
  };

  return (
    <div>
      <button
        className="font-bold py-2 px-4 rounded bg-blue-500 text-white hover:bg-blue-700"
        onClick={openModal}
      >
        Add Feed
      </button>

      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        style={customStyles}
        shouldCloseOnOverlayClick={false}
        ariaHideApp={false}
      >
        <input
          type="url"
          placeholder="https://example/feed"
          onChange={(event) => {setFeedUrl(event.target.value)}}
        />

        <div className="mt-3 text-right">
          <button
            className="font-bold py-2 px-4 rounded bg-red-500 text-white hover:bg-red-700 mr-2"
            onClick={closeModal}
          >
            Close
          </button>

          <button
            className="font-bold py-2 px-4 rounded bg-blue-500 text-white hover:bg-blue-700"
            onClick={addFeed}
          >
            Add
          </button>
        </div>
      </Modal>
    </div>
  );
}