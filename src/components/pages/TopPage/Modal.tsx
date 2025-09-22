import React, { useEffect, useRef } from "react";

export default function Modal({
  isOpenModal,
  setIsOpenModal,
}: {
  isOpenModal: boolean;
  setIsOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  // ---------------------------------------------
  // モーダル外をクリックした時の処理
  // ---------------------------------------------
  const modalRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        modalRef.current &&
        !(modalRef.current as HTMLElement).contains(event.target as Node)
      ) {
        setIsOpenModal(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalRef, setIsOpenModal]);

  // ---------------------------------------------
  // モーダル表示中: 背面のスクロールを禁止
  // ---------------------------------------------
  useEffect(() => {
    if (isOpenModal) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [isOpenModal]);

  return (
    <>
      {isOpenModal && (
        <div className="fixed z-10 top-0 left-0 w-full h-full">
          <div
            className="relative z-20 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-h-[95vh] md:max-h-[90vh] w-[97vw] md:w-[80vw] bg-red-500 border-4 border-yellow-400 shadow-lg rounded-xl animate-pulse flex items-center justify-center"
            ref={modalRef}
          >
            {/* ここにモーダルの中身 */}
            <div className="text-center p-4 md:p-10">
              現在この店舗は休業中です。営業している正しい店舗を選択してください。
            </div>
          </div>
        </div>
      )}
    </>
  );
}
