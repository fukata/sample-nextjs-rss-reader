import Modal from "react-modal";
import { useState } from "react";
import {Feed} from "@prisma/client";

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
export default function AddFeed(
  {onSuccess} : {onSuccess: (feed: Feed) => void}
) {
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

    onSuccess(result.data.feed);
    closeModal();
  };

  return (
    <div className="mb-2">
      <button
        className="w-full py-2 px-4 rounded bg-blue-500 text-white hover:bg-blue-700"
        onClick={openModal}
      >
        RSSを追加
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
            キャンセル
          </button>

          <button
            className="font-bold py-2 px-4 rounded bg-blue-500 text-white hover:bg-blue-700"
            onClick={addFeed}
          >
            登録
          </button>
        </div>
      </Modal>
    </div>
  );
}