import { useAuthUser, useCol } from "@/fiebase/dbHooks";
import { activeClosureAtom } from "@/state";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { RecoilRoot, useSetRecoilState } from "recoil";

const ClosureValueRecoilAndModal = () => {
  const setClosure = useSetRecoilState(activeClosureAtom);
  const [value, loading, error] = useCol<Closures>("closures");
  const currentClosure = value?.docs[0]?.data() as Closures;

  useEffect(() => {
    if (currentClosure) {
      const activeClosure = currentClosure.closureDate?.toDate() > new Date();
      const activeFinalClosure =
        currentClosure.finalClosureDate?.toDate() > new Date();
      setClosure({
        activeFinalClosure,
        activeClosure,
        isClosureActive: currentClosure?.isActive,
      });
    }
  }, [currentClosure, setClosure]);

  return (
    <>
      <input type="checkbox" id="noActiveClosure" className="modal-toggle" />
      <label htmlFor="noActiveClosure" className="modal cursor-pointer">
        <label className="modal-box relative" htmlFor="">
          <h3 className="text-3xl font-bold">
            Ideas are temporarily disabled.
          </h3>
          <p className="py-4">Sharing ideas is closed until next closure.</p>
          <div className="modal-action">
            <label htmlFor="noActiveClosure" className="btn-primary btn">
              OKay
            </label>
          </div>
        </label>
      </label>

      <input
        type="checkbox"
        id="isBeforeFinalClosure"
        className="modal-toggle"
      />
      <label htmlFor="isBeforeFinalClosure" className="modal cursor-pointer">
        <label className="modal-box relative" htmlFor="">
          <h3 className="text-3xl font-bold">
            Cannot download before final closure
          </h3>
          <p className="py-4">
            Downloading of ideas can only be done after final closure
          </p>
          <div className="modal-action">
            <label htmlFor="isBeforeFinalClosure" className="btn-primary btn">
              OKay
            </label>
          </div>
        </label>
      </label>

      <input
        type="checkbox"
        id="notActiveFinalClosure"
        className="modal-toggle"
      />
      <label htmlFor="notActiveFinalClosure" className="modal cursor-pointer">
        <label className="modal-box relative" htmlFor="">
          <h3 className="text-3xl font-bold">
            Comments are temporarily disabled.
          </h3>

          <p className="py-4">
            Commenting ideas on post are closed until next closure.
          </p>
          <div className="modal-action">
            <label htmlFor="notActiveFinalClosure" className="btn-primary btn">
              OKay
            </label>
          </div>
        </label>
      </label>
    </>
  );
};
export default function App({ Component, pageProps }: AppProps) {
  const { user } = useAuthUser();

  return (
    <RecoilRoot>
      <Toaster />
      {user && <ClosureValueRecoilAndModal />}
      <Component {...pageProps} />
    </RecoilRoot>
  );
}
