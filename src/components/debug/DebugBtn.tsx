import { BugOutlined } from '@ant-design/icons';
import { Affix, Switch } from 'antd';
import { createUseStyles } from "react-jss";
import { storageConstants } from '../../constants/const';

const useStyles = createUseStyles(() => ({
    affix: {
        marginLeft: 10,
        
        "& .ant-switch": {
            backgroundColor: '#a3d3ff',
        },
        "& .ant-switch-checked": {
            backgroundColor: '#1890ff',
        }
    },
}))


const DebugBtn = () => {
    const classes = useStyles();
    const checked = localStorage.getItem(storageConstants.KEY_DEBUG) === 'open';

    const handleChange = () => {
        const debug = localStorage.getItem(storageConstants.KEY_DEBUG) || 'close';
        localStorage.setItem(storageConstants.KEY_DEBUG, debug === 'open' ? 'close' : 'open');
    }
    return (
        <Affix offsetBottom={15} className={classes.affix}>
            <Switch
                checkedChildren={<BugOutlined />}
                unCheckedChildren={<BugOutlined />}
                defaultChecked={checked}
                onChange={handleChange}
            />
        </Affix>
    )
}

export default DebugBtn;
