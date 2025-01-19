import { ReactNode } from "react";

type StatProps = {
  classes: string;
  icon?: ReactNode;
  label?: string;
  subLabel?: string;
};

export const Stat = ({ classes }: StatProps) => {
  return (
    <div className={`stats shadow ${classes}  `}>
      <div className="stat">
        <h2 className="stat-title font-medium">Sales today</h2>
        <div className="stat-value">89,400</div>
        {/* <div className="stat-desc">21% more than last month</div> */}
      </div>
    </div>
  );
};
