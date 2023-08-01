import {
  CopyOutlined,
  HomeOutlined,
  LogoutOutlined,
    MenuFoldOutlined,
    ShoppingCartOutlined,
    UnorderedListOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
  } from '@ant-design/icons';
  import { Button, Layout, Menu, theme } from 'antd';
  import react, { useEffect, useState } from 'react';
  import {useSelector} from 'react-redux'
  import "../styles/layout.css"
import { Link, useNavigate } from 'react-router-dom';
import { rootReducer } from './../redux/rootReducer';
import Spinner from './Spinner';
  const { Header, Sider, Content } = Layout;



  const DefaultLayout = ({children}) => {
    const navigate = useNavigate()
    const [collapsed, setCollapsed] = useState(false);
    const {cartItems, loading} = useSelector(state => state.rootReducer)
    const {
      token: { colorBgContainer },
    } = theme.useToken();
    useEffect(() => {
          localStorage.setItem('cartItems', JSON.stringify(cartItems))
    }, [cartItems])
    return (
      <Layout>
        {loading && <Spinner />}
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <h1 className="text-white fw-500 text-center">
            POS
          </h1>
          <div className="demo-logo-vertical" />
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={window.location.pathname}
            
          >
            <Menu.Item key="/" icon={<HomeOutlined /> } >
              <Link to="/"> 
              Home
              </Link>
            </Menu.Item>
            <Menu.Item key="/bills" icon={<CopyOutlined /> } >
              <Link to="/bills"> 
              Bills
              </Link>
            </Menu.Item>
            <Menu.Item key="/items" icon={<UnorderedListOutlined /> } >
              <Link to="/items"> 
              Items
              </Link>
            </Menu.Item>
            <Menu.Item key="/customers" icon={<UserOutlined /> } >
              <Link to="/customers"> 
              Customers
              </Link>
            </Menu.Item>
            <Menu.Item key="" icon={<LogoutOutlined /> }
            onClick={() => {
              localStorage.removeItem('auth')
              navigate('/login')
            } } >
              Logout
            </Menu.Item>
            </Menu>
        </Sider>
        <Layout>
          <Header
            style={{
              padding: 0,
              background: colorBgContainer,
            }}
            className='px-4'
          >
            <Button
              type="text"
              icon={collapsed ? <MenuFoldOutlined /> : <MenuFoldOutlined/>}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: '16px',
                width: 64,
                height: 64,
              }}
            />
            <div className="cart-item d-flex align-items-center gap-3" onClick={() => navigate('/cart')}>
              <p className='mb-0'>{cartItems.length}</p>
              <ShoppingCartOutlined />
            </div>
          </Header>
          <Content
            style={{
              margin: '24px 16px',
              padding: 24,
              minHeight: 280,
              background: colorBgContainer,
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    );
  };
  export default DefaultLayout;
