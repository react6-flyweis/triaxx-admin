// tiny helper to merge classNames (shadcn uses clsx/tailwind-merge normally)
export default function cn(...args) {
  return args.filter(Boolean).join(' ');
}
