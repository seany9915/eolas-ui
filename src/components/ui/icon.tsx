import * as React from 'react';
import { cn } from '@/lib/utils';

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'inline';

/**
 * Standard Material Symbols glyph names used across Eolas UI.
 * Provides IDE autocompletion and compile-time validation while safely
 * supporting any valid Material Symbols ligature via the (string & {}) fallback.
 */
export type AppIconName =
  | 'add'
  | 'archive'
  | 'arrow_back'
  | 'arrow_downward'
  | 'arrow_forward'
  | 'arrow_upward'
  | 'assignment'
  | 'attach_file'
  | 'badge'
  | 'block'
  | 'bookmark'
  | 'branding_watermark'
  | 'cancel'
  | 'category'
  | 'chat'
  | 'check'
  | 'check_circle'
  | 'checklist'
  | 'chevron_left'
  | 'chevron_right'
  | 'clear'
  | 'close'
  | 'cloud_sync'
  | 'cloud_upload'
  | 'code'
  | 'content_copy'
  | 'contrast'
  | 'crop_free'
  | 'delete'
  | 'density_medium'
  | 'description'
  | 'desktop_windows'
  | 'download'
  | 'edit'
  | 'emoji_events'
  | 'error'
  | 'event'
  | 'expand_less'
  | 'expand_more'
  | 'extension'
  | 'favorite'
  | 'file_download'
  | 'filter_list'
  | 'first_page'
  | 'flag'
  | 'folder'
  | 'folder_open'
  | 'format_bold'
  | 'forum'
  | 'fullscreen'
  | 'gavel'
  | 'graphic_eq'
  | 'grid_view'
  | 'groups'
  | 'health_and_safety'
  | 'hearing'
  | 'history'
  | 'inbox'
  | 'info'
  | 'ios_share'
  | 'language'
  | 'last_page'
  | 'lightbulb'
  | 'local_hospital'
  | 'lock'
  | 'logout'
  | 'mail'
  | 'match_case'
  | 'medical_services'
  | 'menu'
  | 'menu_book'
  | 'menu_open'
  | 'mic'
  | 'mic_off'
  | 'monitor_heart'
  | 'monitoring'
  | 'more_horiz'
  | 'more_vert'
  | 'nature'
  | 'notifications'
  | 'notifications_active'
  | 'open_in_new'
  | 'palette'
  | 'person'
  | 'person_add'
  | 'platforms'
  | 'play_arrow'
  | 'print'
  | 'priority_high'
  | 'progress_activity'
  | 'psychology'
  | 'radio_button_checked'
  | 'radio_button_unchecked'
  | 'record_voice_over'
  | 'redo'
  | 'refresh'
  | 'remove'
  | 'report'
  | 'restart_alt'
  | 'route'
  | 'schedule'
  | 'search'
  | 'search_off'
  | 'security'
  | 'share'
  | 'show_chart'
  | 'skip_next'
  | 'smartphone'
  | 'star'
  | 'stars'
  | 'summarize'
  | 'swap_horiz'
  | 'swipe'
  | 'table_chart'
  | 'tablet_mac'
  | 'task_alt'
  | 'timer'
  | 'touch_app'
  | 'tune'
  | 'undo'
  | 'unfold_less'
  | 'unfold_more'
  | 'verified'
  | 'verified_user'
  | 'view_list'
  | 'visibility'
  | 'visibility_off'
  | 'volume_up'
  | 'warning'
  | 'widgets'
  | 'wifi_tethering'
  | 'workspace_premium'
  | (string & {});

export interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  name: AppIconName;
  size?: IconSize;
  srLabel?: string;
  className?: string;
}

const sizeClasses: Record<IconSize, string> = {
  xs: 'text-xs text-[14px]',
  sm: 'text-base text-[16px]',
  md: 'text-lg text-[20px]',
  lg: 'text-xl text-[24px]',
  xl: 'text-2xl text-[32px]',
  inline: 'text-[1.15cap] align-baseline inline-block leading-none',
};

const BaseIcon = React.forwardRef<HTMLSpanElement, IconProps>(({
  name,
  size = 'lg',
  srLabel,
  className,
  ...props
}, ref) => {
  const isDecorative = !srLabel && !props['aria-label'];

  return (
    <>
      <span
        ref={ref}
        className={cn('material-symbols-outlined select-none inline-block align-middle leading-none', sizeClasses[size], className)}
        aria-hidden={isDecorative || srLabel ? 'true' : undefined}
        aria-label={props['aria-label']}
        {...props}
      >
        {name}
      </span>
      {srLabel && <span className="sr-only">{srLabel}</span>}
    </>
  );
});

BaseIcon.displayName = 'Icon';

export interface ToggleIconProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'> {
  active: boolean;
  onName: AppIconName;
  offName: AppIconName;
  size?: IconSize;
  srLabel?: string;
  onLabel?: string;
  offLabel?: string;
  className?: string;
}

/**
 * ToggleIcon seamlessly morphs between two icon states (e.g. copy -> check, mute -> unmute)
 * using an aligned single-cell grid, avoiding layout shift and providing a calibrated cross-fade.
 */
export const ToggleIcon = React.forwardRef<HTMLSpanElement, ToggleIconProps>(({
  active,
  onName,
  offName,
  size = 'lg',
  srLabel,
  onLabel,
  offLabel,
  className,
  ...props
}, ref) => {
  const activeLabel = srLabel ?? (active ? onLabel : offLabel);
  const isDecorative = !activeLabel && !props['aria-label'];

  return (
    <span
      ref={ref}
      className={cn('inline-grid grid-cols-1 grid-rows-1 place-items-center select-none align-middle', className)}
      aria-hidden={isDecorative ? 'true' : undefined}
      aria-label={props['aria-label']}
      {...props}
    >
      <BaseIcon
        name={offName}
        size={size}
        className={cn(
          'col-start-1 row-start-1 transition-[opacity,transform,filter] duration-[var(--duration-fast)] ease-[var(--ease-standard)] motion-reduce:transition-none',
          active
            ? 'opacity-0 scale-[0.25] blur-[var(--blur-small)] pointer-events-none'
            : 'opacity-100 scale-100 blur-none'
        )}
      />
      <BaseIcon
        name={onName}
        size={size}
        className={cn(
          'col-start-1 row-start-1 transition-[opacity,transform,filter] duration-[var(--duration-fast)] ease-[var(--ease-standard)] motion-reduce:transition-none',
          active
            ? 'opacity-100 scale-100 blur-none'
            : 'opacity-0 scale-[0.25] blur-[var(--blur-small)] pointer-events-none'
        )}
      />
      {activeLabel && <span className="sr-only">{activeLabel}</span>}
    </span>
  );
});

ToggleIcon.displayName = 'ToggleIcon';

export interface CrossFadeIconProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'> {
  name: string;
  size?: IconSize;
  srLabel?: string;
  className?: string;
}

/**
 * CrossFadeIcon smoothly transitions whenever the icon name changes dynamically,
 * fading out the previous symbol while scaling in the new symbol.
 */
export const CrossFadeIcon = React.forwardRef<HTMLSpanElement, CrossFadeIconProps>(({
  name,
  size = 'lg',
  srLabel,
  className,
  ...props
}, ref) => {
  const [currentName, setCurrentName] = React.useState(name);
  const [prevName, setPrevName] = React.useState<string | null>(null);
  const [entered, setEntered] = React.useState(true);

  // Stage the swap during render so the timer effect below is not torn down by its own state updates.
  if (name !== currentName) {
    setPrevName(currentName);
    setCurrentName(name);
    setEntered(false);
  }

  // Mount both icons in their start state, then flip on the next frames so the transition runs.
  React.useEffect(() => {
    if (entered) return;
    let raf2 = 0;
    const raf1 = window.requestAnimationFrame(() => {
      raf2 = window.requestAnimationFrame(() => setEntered(true));
    });
    return () => {
      window.cancelAnimationFrame(raf1);
      window.cancelAnimationFrame(raf2);
    };
  }, [entered, currentName]);

  React.useEffect(() => {
    if (!prevName) return;
    const timer = window.setTimeout(() => setPrevName(null), 250); // Matches --duration-fast (250ms)
    return () => window.clearTimeout(timer);
  }, [prevName]);
  const isDecorative = !srLabel && !props['aria-label'];

  return (
    <span
      ref={ref}
      className={cn('inline-grid grid-cols-1 grid-rows-1 place-items-center select-none align-middle', className)}
      aria-hidden={isDecorative ? 'true' : undefined}
      aria-label={props['aria-label']}
      {...props}
    >
      {prevName && (
        <BaseIcon
          name={prevName}
          size={size}
          className={cn(
            'col-start-1 row-start-1 transition-[opacity,transform,filter] duration-[var(--duration-fast)] ease-[var(--ease-standard)] pointer-events-none motion-reduce:transition-none',
            entered ? 'opacity-0 scale-[0.25] blur-[var(--blur-small)]' : 'opacity-100 scale-100 blur-none'
          )}
        />
      )}
      <BaseIcon
        name={currentName}
        size={size}
        className={cn(
          'col-start-1 row-start-1 transition-[opacity,transform,filter] duration-[var(--duration-fast)] ease-[var(--ease-standard)] motion-reduce:transition-none',
          entered ? 'opacity-100 scale-100 blur-none' : 'opacity-0 scale-[0.25] blur-[var(--blur-small)]'
        )}
      />
      {srLabel && <span className="sr-only">{srLabel}</span>}
    </span>
  );
});

CrossFadeIcon.displayName = 'CrossFadeIcon';

export const Icon = Object.assign(BaseIcon, {
  Toggle: ToggleIcon,
  CrossFade: CrossFadeIcon,
});

export default Icon;

