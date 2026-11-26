'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion';

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'inline';

/**
 * Standard Material Symbols glyph names used across Eolas UI.
 * Provides IDE autocompletion and compile-time validation while safely
 * supporting any valid Material Symbols ligature via the (string & {}) fallback.
 */
export type AppIconName =
  | 'accessibility_new'
  | 'add'
  | 'analytics'
  | 'animation'
  | 'archive'
  | 'arrow_back'
  | 'arrow_downward'
  | 'arrow_drop_down'
  | 'arrow_forward'
  | 'arrow_upward'
  | 'assignment'
  | 'attach_file'
  | 'badge'
  | 'block'
  | 'bolt'
  | 'bookmark'
  | 'bookmark_added'
  | 'branding_watermark'
  | 'calendar_today'
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
  | 'dashboard'
  | 'delete'
  | 'density_medium'
  | 'description'
  | 'desktop_windows'
  | 'download'
  | 'edit'
  | 'edit_note'
  | 'emoji_events'
  | 'error'
  | 'event'
  | 'expand_less'
  | 'expand_more'
  | 'explore'
  | 'extension'
  | 'face'
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
  | 'hourglass_empty'
  | 'hub'
  | 'inbox'
  | 'info'
  | 'insights'
  | 'inventory_2'
  | 'ios_share'
  | 'keyboard_arrow_down'
  | 'keyboard_arrow_up'
  | 'language'
  | 'last_page'
  | 'layers'
  | 'left_panel_close'
  | 'left_panel_open'
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
  | 'mic_none'
  | 'mic_off'
  | 'monitor_heart'
  | 'monitoring'
  | 'more_horiz'
  | 'more_vert'
  | 'nature'
  | 'notifications'
  | 'notifications_active'
  | 'open_in_new'
  | 'outgoing_mail'
  | 'palette'
  | 'pending_actions'
  | 'person'
  | 'person_add'
  | 'platforms'
  | 'play_arrow'
  | 'play_circle'
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
  | 'right_panel_close'
  | 'right_panel_open'
  | 'route'
  | 'schedule'
  | 'search'
  | 'search_off'
  | 'security'
  | 'settings'
  | 'share'
  | 'shield'
  | 'show_chart'
  | 'skip_next'
  | 'smart_toy'
  | 'smartphone'
  | 'spatial_audio'
  | 'spellcheck'
  | 'star'
  | 'stop'
  | 'summarize'
  | 'swap_horiz'
  | 'swipe'
  | 'table_chart'
  | 'tablet_mac'
  | 'task_alt'
  | 'terminal'
  | 'timer'
  | 'tips_and_updates'
  | 'touch_app'
  | 'translate'
  | 'trending_down'
  | 'trending_flat'
  | 'trending_up'
  | 'tune'
  | 'undo'
  | 'unfold_less'
  | 'unfold_more'
  | 'upload'
  | 'verified'
  | 'verified_user'
  | 'view_list'
  | 'visibility'
  | 'visibility_off'
  | 'volume_off'
  | 'volume_up'
  | 'warning'
  | 'widgets'
  | 'wifi_tethering'
  | 'workspace_premium'
  | (string & {});

export interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  name: AppIconName;
  size?: IconSize;
  /** Renders the solid filled variant (FILL = 1) for active or selected states. */
  filled?: boolean;
  srLabel?: string;
  /** Mirrors directional icons (arrows, chevrons, undo/redo, speaker waves) in RTL layouts. */
  directional?: boolean;
  className?: string;
}

const sizeClasses: Record<IconSize, string> = {
  xs: 'text-[14px]',
  sm: 'text-[16px]',
  md: 'text-[20px]',
  lg: 'text-[24px]',
  xl: 'text-[32px]',
  inline: 'text-[1.15cap] align-baseline inline-block leading-none',
};

const sizeOpsz: Record<IconSize, number> = {
  xs: 20,
  sm: 20,
  md: 20,
  lg: 24,
  xl: 40,
  inline: 20,
};

const BaseIcon = React.forwardRef<HTMLSpanElement, IconProps>(({
  name,
  size = 'lg',
  filled = false,
  srLabel,
  directional = false,
  className,
  style,
  role,
  ...props
}, ref) => {
  const hasAriaLabel = Boolean(props['aria-label']);
  const isDecorative = !srLabel && !hasAriaLabel;
  const iconStyle: React.CSSProperties = {
    '--icon-opsz': sizeOpsz[size],
    '--icon-fill': filled ? 1 : 0,
    ...style,
  } as React.CSSProperties;

  if (srLabel) {
    return (
      <span
        ref={ref}
        className={cn(
          size === 'inline' ? 'inline-block align-baseline' : 'inline-flex items-center',
          sizeClasses[size],
          className
        )}
        style={iconStyle}
        role={role}
        {...props}
      >
        <span
          className={cn(
            'material-symbols-outlined select-none leading-none text-[inherit]',
            size === 'inline'
              ? 'inline-block align-baseline'
              : 'inline-flex size-[1em] shrink-0 items-center justify-center',
            directional && 'icon-directional'
          )}
          aria-hidden="true"
        >
          {name}
        </span>
        <span className="sr-only">{srLabel}</span>
      </span>
    );
  }

  return (
    <span
      ref={ref}
      className={cn(
        'material-symbols-outlined select-none leading-none',
        size === 'inline'
          ? 'inline-block align-baseline'
          : 'inline-flex size-[1em] shrink-0 items-center justify-center',
        sizeClasses[size],
        directional && 'icon-directional',
        className
      )}
      style={iconStyle}
      role={role ?? (hasAriaLabel ? 'img' : undefined)}
      aria-hidden={isDecorative ? 'true' : undefined}
      aria-label={props['aria-label']}
      {...props}
    >
      {name}
    </span>
  );
});

BaseIcon.displayName = 'Icon';

export interface ToggleIconProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'> {
  active: boolean;
  onName: AppIconName;
  offName: AppIconName;
  size?: IconSize;
  filled?: boolean;
  srLabel?: string;
  onLabel?: string;
  offLabel?: string;
  /** Mirrors directional icons horizontally in RTL layouts without colliding with inner scale transitions. */
  directional?: boolean;
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
  filled = false,
  srLabel,
  onLabel,
  offLabel,
  directional = false,
  className,
  role,
  ...props
}, ref) => {
  const hasAriaLabel = Boolean(props['aria-label']);
  const activeLabel = srLabel ?? (active ? onLabel : offLabel);
  const isDecorative = !activeLabel && !hasAriaLabel;

  return (
    <span
      ref={ref}
      className={cn(
        'inline-grid grid-cols-1 grid-rows-1 place-items-center select-none align-middle',
        directional && 'icon-directional',
        className
      )}
      role={role ?? (hasAriaLabel ? 'img' : undefined)}
      aria-hidden={isDecorative ? 'true' : undefined}
      aria-label={props['aria-label']}
      {...props}
    >
      <BaseIcon
        name={offName}
        size={size}
        filled={filled}
        className={cn(
          'col-start-1 row-start-1 transition-[opacity,transform,filter] duration-[var(--duration-quick)] ease-[var(--ease-standard)] motion-reduce:transition-none',
          active
            ? 'opacity-0 scale-[0.25] blur-[var(--blur-small)] pointer-events-none'
            : 'opacity-100 scale-100 blur-none'
        )}
      />
      <BaseIcon
        name={onName}
        size={size}
        filled={filled}
        className={cn(
          'col-start-1 row-start-1 transition-[opacity,transform,filter] duration-[var(--duration-quick)] ease-[var(--ease-standard)] motion-reduce:transition-none',
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
  filled?: boolean;
  directional?: boolean;
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
  filled = false,
  directional = false,
  srLabel,
  className,
  role,
  ...props
}, ref) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [currentName, setCurrentName] = React.useState(name);
  const [prevName, setPrevName] = React.useState<string | null>(null);
  const [entered, setEntered] = React.useState(true);

  // Stage the swap during render so the timer effect below is not torn down by its own state updates.
  if (name !== currentName) {
    setCurrentName(name);
    if (prefersReducedMotion) {
      setPrevName(null);
      setEntered(true);
    } else {
      setPrevName(currentName);
      setEntered(false);
    }
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
    const timer = window.setTimeout(() => setPrevName(null), 150); // Matches --duration-quick (150ms)
    return () => window.clearTimeout(timer);
  }, [prevName]);
  const hasAriaLabel = Boolean(props['aria-label']);
  const isDecorative = !srLabel && !hasAriaLabel;

  return (
    <span
      ref={ref}
      className={cn(
        'inline-grid grid-cols-1 grid-rows-1 place-items-center select-none align-middle',
        directional && 'icon-directional',
        className
      )}
      role={role ?? (hasAriaLabel ? 'img' : undefined)}
      aria-hidden={isDecorative ? 'true' : undefined}
      aria-label={props['aria-label']}
      {...props}
    >
      {prevName && (
        <BaseIcon
          name={prevName}
          size={size}
          filled={filled}
          className={cn(
            'col-start-1 row-start-1 transition-[opacity,transform,filter] duration-[var(--duration-quick)] ease-[var(--ease-standard)] pointer-events-none motion-reduce:transition-none',
            entered ? 'opacity-0 scale-[0.25] blur-[var(--blur-small)]' : 'opacity-100 scale-100 blur-none'
          )}
        />
      )}
      <BaseIcon
        name={currentName}
        size={size}
        filled={filled}
        className={cn(
          'col-start-1 row-start-1 transition-[opacity,transform,filter] duration-[var(--duration-quick)] ease-[var(--ease-standard)] motion-reduce:transition-none',
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

