import React, { createElement, forwardRef } from "react";
import type { CreateBoxParams } from "./types";

interface AtomsFnBase {
  (...args: any): string;
  properties: Set<string>;
}

type HTMLProperties = Omit<
  React.AllHTMLAttributes<HTMLElement>,
  "as" | "color" | "height" | "width"
>;

export function createBox<AtomsFn extends AtomsFnBase>({
  atoms: atomsFn,
  defaultClassName,
}: CreateBoxParams<AtomsFn>) {
  type BoxProps = {
    as?: React.ElementType;
    children?: React.ReactNode;
    className?: string;
  } & Parameters<AtomsFn>[0] &
    HTMLProperties;

  const Box = forwardRef<HTMLElement, BoxProps>(
    ({ as: element = "div", className, ...props }: BoxProps, ref) => {
      let hasAtomProps = false;
      let atomProps: Record<string, unknown> = {};
      let otherProps: Record<string, unknown> = {};

      for (const key in props) {
        if (atomsFn.properties.has(key)) {
          hasAtomProps = true;
          atomProps[key] = props[key];
        } else {
          otherProps[key] = props[key];
        }
      }

      return createElement(element, {
        ref,
        ...otherProps,
        className:
          (hasAtomProps || className
            ? `${className ?? ""}${hasAtomProps && className ? " " : ""}${
                hasAtomProps ? atomsFn(atomProps) : ""
              }`
            : undefined) + (defaultClassName ? ` ${defaultClassName}` : ""),
      });
    }
  );

  return Box;
}

export function createBoxWithAtomsProp<AtomsFn extends AtomsFnBase>({
  atoms: atomsFn,
  defaultClassName,
}: CreateBoxParams<AtomsFn>) {
  type BoxProps = {
    as?: React.ElementType;
    children?: React.ReactNode;
    className?: string;
    atoms?: Parameters<AtomsFn>[0];
  } & HTMLProperties;

  const Box = forwardRef<HTMLElement, BoxProps>(
    ({ as: element = "div", className, atoms, ...props }, ref) => {
      const hasAtomProps = typeof atoms !== "undefined";

      return createElement(element, {
        ref,
        ...props,
        className:
          (hasAtomProps || className
            ? `${className ?? ""}${hasAtomProps && className ? " " : ""}${
                hasAtomProps ? atomsFn(atoms) : ""
              }`
            : undefined) + (defaultClassName ? ` ${defaultClassName}` : ""),
      });
    }
  );

  return Box;
}
