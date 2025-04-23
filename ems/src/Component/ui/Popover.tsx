// filepath: /c:/Users/2389633/Downloads/finalapp/app/ems/src/components/ui/Popover.tsx
import React from 'react';
import { Popover as BootstrapPopover, OverlayTrigger } from 'react-bootstrap';

export const Popover: React.FC<{ content: React.ReactNode; children: React.ReactElement }> = ({
    content,
    children,
}) => {
    return (
        <OverlayTrigger
            trigger="click"
            placement="bottom"
            overlay={
                <BootstrapPopover>
                    <BootstrapPopover.Body>{content}</BootstrapPopover.Body>
                </BootstrapPopover>
            }
        >
            {children}
        </OverlayTrigger>
    );
};