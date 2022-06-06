import { cloneElement, ReactElement, useRef, useState } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';
import clsx from 'clsx';

export type DropdownProps = React.PropsWithChildren<{
  toggle: ({ visibility }: { visibility: boolean }) => ReactElement;
}>;

export function DropdownItem(item: ReactElement) {
  const extendedItem = cloneElement(item, {
    className: clsx(item.props.className, 'dropdown-menu-item-content'),
  });
  return (
    <li className="dropdown-menu-item" key={item.props.children}>
      {extendedItem}
    </li>
  );
}

export function Dropdown({ toggle, children }: DropdownProps) {
  const dropdownRef = useRef<HTMLUListElement>(null);
  const [visibility, setVisibility] = useState(false);
  const toggleElement = cloneElement(toggle({ visibility }), {
    onClick: () => setVisibility(!visibility),
    'aria-expanded': visibility,
    'aria-controls': dropdownRef.current?.id,
  });
  return (
    <OutsideClickHandler display='flex' onOutsideClick={() => setVisibility(false)}>
      <div className="dropdown">
        {toggleElement}
        <ul ref={dropdownRef} className={clsx('dropdown-menu', { 'dropdown-menu-visible': visibility })}>
          {Array.isArray(children) && children.map(DropdownItem)}
        </ul>
      </div>
    </OutsideClickHandler>
  );
}

export default Dropdown;
