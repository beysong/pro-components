import { CloseOutlined, DownOutlined } from '@ant-design/icons';
import { useIntl } from '@ant-design/pro-provider';
import { ConfigProvider } from 'antd';
import type { SizeType } from 'antd/lib/config-provider/SizeContext';
import classNames from 'classnames';
import React, { useContext, useImperativeHandle, useRef } from 'react';
import './index.less';

export type FieldLabelProps = {
  label?: React.ReactNode;
  value?: any;
  disabled?: boolean;
  onClear?: () => void;
  size?: SizeType;
  ellipsis?: boolean;
  placeholder?: React.ReactNode;
  expanded?: boolean;
  className?: string;
  formatter?: (value: any) => React.ReactNode;
  style?: React.CSSProperties;
  bordered?: boolean;
  allowClear?: boolean;
};

const FieldLabel: React.ForwardRefRenderFunction<any, FieldLabelProps> = (props, ref) => {
  const {
    label,
    onClear,
    value,
    size = 'middle',
    disabled,
    ellipsis,
    placeholder,
    className,
    style,
    formatter,
    bordered,
    allowClear = true,
  } = props;
  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
  const prefixCls = getPrefixCls('pro-core-field-label');
  const intl = useIntl();
  const clearRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLElement>(null);

  useImperativeHandle(ref, () => ({
    labelRef,
    clearRef,
  }));

  const formatterText = (aValue: any) => {
    if (formatter) {
      return formatter(aValue);
    }
    return Array.isArray(aValue) ? aValue.join(',') : String(aValue);
  };

  const getTextByValue = (
    aLabel?: React.ReactNode | React.ReactNode[],
    aValue?: string | string[],
  ): React.ReactNode => {
    if (
      aValue !== undefined &&
      aValue !== null &&
      aValue !== '' &&
      (!Array.isArray(aValue) || aValue.length)
    ) {
      const prefix = aLabel ? (
        <>
          {aLabel}
          {': '}
        </>
      ) : (
        ''
      );
      const str = formatterText(aValue);
      if (!ellipsis) {
        return (
          <span>
            {prefix}
            {formatterText(aValue)}
          </span>
        );
      }

      const getText = () => {
        const isArrayValue = Array.isArray(aValue) && aValue.length > 1;
        const unitText = intl.getMessage('form.lightFilter.itemUnit', '项');
        if (typeof str === 'string' && str.length > 32 && isArrayValue) {
          return `...${aValue.length}${unitText}`;
        }
        return '';
      };
      const tail = getText();

      return (
        <span
          title={typeof str === 'string' ? str : undefined}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
          }}
        >
          {prefix}
          <span style={{ paddingLeft: 4 }}>
            {typeof str === 'string' ? str?.toString()?.substr?.(0, 32) : str}
          </span>
          {tail}
        </span>
      );
    }
    return aLabel || placeholder;
  };
  return (
    <span
      className={classNames(
        prefixCls,
        `${prefixCls}-${size}`,
        {
          [`${prefixCls}-active`]: !!value || value === 0,
          [`${prefixCls}-disabled`]: disabled,
          [`${prefixCls}-bordered`]: bordered,
          [`${prefixCls}-allow-clear`]: allowClear,
        },
        className,
      )}
      style={style}
      ref={labelRef}
    >
      {getTextByValue(label, value)}
      {(value || value === 0) && allowClear && (
        <CloseOutlined
          role="button"
          title="清除"
          className={classNames(`${prefixCls}-icon`, `${prefixCls}-close`)}
          onClick={(e) => {
            if (onClear && !disabled) {
              onClear();
            }
            e.stopPropagation();
          }}
          ref={clearRef}
        />
      )}
      <DownOutlined className={classNames(`${prefixCls}-icon`, `${prefixCls}-arrow`)} />
    </span>
  );
};

export default React.forwardRef(FieldLabel);
