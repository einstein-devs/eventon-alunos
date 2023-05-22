import classNames from "classnames";

type TabButtonData = {
  isActive: boolean;
  onClick: () => void;
  text: string;
};

export function TabButton({ isActive, onClick, text }: TabButtonData) {
  const buttonClasses = classNames(
    "hover:bg-orange-50 transition-colors border-b-[1px] h-full flex-1 flex items-center justify-center",
    {
      "border-b-orange-400": isActive,
    }
  );

  const buttonTextClasses = classNames("text-md font-bold", {
    "text-orange-400": isActive,
  });

  return (
    <button onClick={onClick} className={buttonClasses}>
      <p className={buttonTextClasses}>{text}</p>
    </button>
  );
}
