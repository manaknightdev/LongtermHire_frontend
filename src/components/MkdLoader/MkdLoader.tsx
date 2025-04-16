import React, { memo, useId } from "react";
import {
  BeatLoader,
  SyncLoader,
  BarLoader,
  BounceLoader,
  CircleLoader,
  ClimbingBoxLoader,
  ClipLoader,
  ClockLoader,
  DotLoader,
  FadeLoader,
  GridLoader,
  HashLoader,
  MoonLoader,
  RingLoader,
  RiseLoader,
  PacmanLoader,
  PropagateLoader,
  PuffLoader,
  PulseLoader,
  RotateLoader,
  ScaleLoader,
  SkewLoader,
  SquareLoader,
} from "react-spinners";

export enum LoaderTypes {
  BEAT = "beat",
  SYNC = "sync",
  BAR = "bar",
  BOUNCE = "bounce",
  CIRCLE = "circle",
  CLIMBINGBOX = "climbingbox",
  CLIP = "clip",
  CLOCK = "clock",
  DOT = "dot",
  FADE = "fade",
  GRID = "grid",
  HASH = "hash",
  MOON = "moon",
  RING = "ring",
  RISE = "rise",
  PACMAN = "pacman",
  PROPAGATE = "propagate",
  PUFF = "puff",
  PULSE = "pulse",
  ROTATE = "rotate",
  SCALE = "scale",
  SKEW = "skew",
  SQUARE = "square",
}

/**
 * @function
 * @description Component for rendering various loaders.
 * @param {Object} props Component props
 * @param {string} [props.type] default "beat"
 * @param {string} [props.color] default "#ffffff"
 * @param {boolean} [props.loading] default false
 * @param {string} [props.className]
 * @param {string} [props.loaderclasses]
 * @param {React.ReactNode} [props.children]
 * @param {number} [props.size] default 10
 * @returns
 */

interface MkdLoaderProps {
  type?: "beat" | "sync" | "bar" | "bounce" | "circle" | "climbingbox" | "clip" | "clock" | "dot" | "fade" | "grid" | "hash" | "moon" | "ring" | "rise" | "pacman" | "propagate" | "puff" | "pulse" | "rotate" | "scale" | "skew" | "square";
  children?: React.ReactNode;
  className?: string;
  loaderclasses?: string;
  loading?: boolean;
  color?: string;
  size?: number;
}

const MkdLoader = ({
  type = LoaderTypes.BEAT,
  children,
  className,
  loaderclasses,
  loading = false,
  color = "#ffffff",
  size = 10,
}: MkdLoaderProps) => {
  const override = {
    borderColor: "#ffffff",
  };
  const id = useId();
  const LOADERS = {
    beat: BeatLoader,
    sync: SyncLoader,
    bar: BarLoader,
    bounce: BounceLoader,
    circle: CircleLoader,
    climbingbox: ClimbingBoxLoader,
    clip: ClipLoader,
    clock: ClockLoader,
    dot: DotLoader,
    fade: FadeLoader,
    grid: GridLoader,
    hash: HashLoader,
    moon: MoonLoader,
    ring: RingLoader,
    rise: RiseLoader,
    pacman: PacmanLoader,
    propagate: PropagateLoader,
    puff: PuffLoader,
    pulse: PulseLoader,
    rotate: RotateLoader,
    scale: ScaleLoader,
    skew: SkewLoader,
    square: SquareLoader,
  };
  const Loader = LOADERS[type];

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <>
        {children}

        <Loader
          color={color}
          loading={loading}
          cssOverride={override}
          size={size}
          className={loaderclasses}
          // aria-label="Loading Spinner"
          data-testid={id}
        />
      </>
    </div>
  );
};

export default memo(MkdLoader);
