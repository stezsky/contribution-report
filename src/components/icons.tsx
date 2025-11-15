import React from 'react';

export type IconProps = React.SVGProps<SVGSVGElement> & {
  title?: string;
};

const baseIconProps = {
  role: 'img',
  'aria-hidden': true,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const
};

export const ChartIcon: React.FC<IconProps> = ({ title = 'Analytics icon', ...props }) => (
  <svg viewBox="0 0 24 24" {...baseIconProps} {...props}>
    {title ? <title>{title}</title> : null}
    <path d="M4 5h16M4 19h16" />
    <path d="M7 19V9" />
    <path d="M12 19V5" />
    <path d="M17 19v-6" />
  </svg>
);

export const CalendarIcon: React.FC<IconProps> = ({ title = 'Calendar icon', ...props }) => (
  <svg viewBox="0 0 24 24" {...baseIconProps} {...props}>
    {title ? <title>{title}</title> : null}
    <rect x="3" y="4" width="18" height="17" rx="2.5" />
    <path d="M7 2v4" />
    <path d="M17 2v4" />
    <path d="M3 10h18" />
  </svg>
);

export const UsersIcon: React.FC<IconProps> = ({ title = 'Users icon', ...props }) => (
  <svg viewBox="0 0 24 24" {...baseIconProps} {...props}>
    {title ? <title>{title}</title> : null}
    <circle cx="9" cy="8" r="3" />
    <path d="M15 10a3 3 0 1 0 0-6" />
    <path d="M3 20c0-3.314 2.239-6 5-6h2c2.761 0 5 2.686 5 6" />
    <path d="M14 20c0-1.89.756-3.544 2.045-4.65A4.988 4.988 0 0 1 21 20" />
  </svg>
);

export const InfoIcon: React.FC<IconProps> = ({ title = 'Information icon', ...props }) => (
  <svg viewBox="0 0 24 24" {...baseIconProps} {...props}>
    {title ? <title>{title}</title> : null}
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8h.01" />
    <path d="M11 12h1v4h1" />
  </svg>
);

export const AlertIcon: React.FC<IconProps> = ({ title = 'Alert icon', ...props }) => (
  <svg viewBox="0 0 24 24" {...baseIconProps} {...props}>
    {title ? <title>{title}</title> : null}
    <path d="M12 3 2 20h20L12 3Z" />
    <path d="M12 10v4" />
    <path d="M12 16h.01" />
  </svg>
);

export const EmptyStateIcon: React.FC<IconProps> = ({ title = 'Empty state icon', ...props }) => (
  <svg viewBox="0 0 24 24" {...baseIconProps} {...props}>
    {title ? <title>{title}</title> : null}
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3 9h18" />
    <path d="M7 13h4" />
    <path d="M7 17h10" />
  </svg>
);

export const NoDataIcon: React.FC<IconProps> = ({ title = 'No data icon', ...props }) => (
  <svg viewBox="0 0 24 24" {...baseIconProps} {...props}>
    {title ? <title>{title}</title> : null}
    <circle cx="12" cy="12" r="8" />
    <path d="m8.5 8.5 7 7" />
    <path d="m15.5 8.5-7 7" />
  </svg>
);

export const SparkIcon: React.FC<IconProps> = ({ title = 'Performance icon', ...props }) => (
  <svg viewBox="0 0 24 24" {...baseIconProps} {...props}>
    {title ? <title>{title}</title> : null}
    <path d="m12 2 2 6 6 2-6 2-2 6-2-6-6-2 6-2 2-6Z" />
  </svg>
);

export const BugIcon: React.FC<IconProps> = ({ title = 'Bug icon', ...props }) => (
  <svg viewBox="0 0 24 24" {...baseIconProps} {...props}>
    {title ? <title>{title}</title> : null}
    <path d="M9 9V5a3 3 0 0 1 6 0v4" />
    <rect x="6" y="9" width="12" height="10" rx="4" />
    <path d="M4 13h16" />
    <path d="M4 17h16" />
    <path d="M5 9 3 7" />
    <path d="M19 9 21 7" />
  </svg>
);

export const ClipboardIcon: React.FC<IconProps> = ({ title = 'Clipboard icon', ...props }) => (
  <svg viewBox="0 0 24 24" {...baseIconProps} {...props}>
    {title ? <title>{title}</title> : null}
    <rect x="6" y="4" width="12" height="16" rx="2" />
    <path d="M9 2h6v4H9z" />
    <path d="M9 10h6" />
    <path d="M9 14h4" />
  </svg>
);

export const ColumnsIcon: React.FC<IconProps> = ({ title = 'Bar chart icon', ...props }) => (
  <svg viewBox="0 0 24 24" {...baseIconProps} {...props}>
    {title ? <title>{title}</title> : null}
    <path d="M4 20h16" />
    <rect x="6" y="10" width="3" height="7" rx="1" />
    <rect x="11" y="6" width="3" height="11" rx="1" />
    <rect x="16" y="12" width="3" height="5" rx="1" />
  </svg>
);

export const LoadingIcon: React.FC<IconProps> = ({ title = 'Loading icon', ...props }) => (
  <svg viewBox="0 0 24 24" {...baseIconProps} {...props}>
    {title ? <title>{title}</title> : null}
    <circle cx="12" cy="12" r="9" strokeDasharray="56" strokeDashoffset="14" />
  </svg>
);
