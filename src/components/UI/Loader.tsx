export const Loader = ({ isFullHeight = true }) => (
  <div
    className={`flex ${
      isFullHeight ? "h-screen" : ""
    } w-full flex-row items-center justify-center`}
  >
    <div className="lds-facebook">
      <div></div>
      <div></div>
      <div></div>
    </div>
  </div>
);
