import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Link from 'next/link';
import { withRouter } from 'next/router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  withStyles,
  ButtonGroup,
  IconButton,
  Collapse,
  Divider,
  Drawer,
  List,
  ListItem,
  Grow,
  ListItemIcon,
  ListItemText,
  NoSsr,
  Zoom,
} from '@material-ui/core';
import RemoveIcon from '@material-ui/icons/Remove';
import HelpIcon from '@material-ui/icons/Help';
import DashboardIcon from '@material-ui/icons/Dashboard';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAngleLeft,
  faCaretDown,
  faExternalLinkAlt,
  faDigitalTachograph,
} from '@fortawesome/free-solid-svg-icons';
import LifecycleIcon from '../public/static/img/drawer-icons/lifecycle_mgmt_svg';
import PerformanceIcon from '../public/static/img/drawer-icons/performance_svg';
import ExtensionIcon from '../public/static/img/drawer-icons/extensions_svg';
import FilterIcon from '../public/static/img/drawer-icons/filter_svg';
import PatternIcon from '../public/static/img/drawer-icons/pattern_svg';
import LifecycleHover from '../public/static/img/drawer-icons/lifecycle_hover_svg';
import PerformanceHover from '../public/static/img/drawer-icons/performance_hover_svg';
import ConfigurationHover from '../public/static/img/drawer-icons/configuration_hover_svg';
import ConfigurationIcon from '../assets/icons/ConfigurationIcon';
import DocumentIcon from '../assets/icons/DocumentIcon';
import SlackIcon from '../assets/icons/SlackIcon';
import GithubIcon from '../assets/icons/GithubIcon';
import ChatIcon from '../assets/icons/ChatIcon';
import ServiceMeshIcon from '../assets/icons/ServiceMeshIcon';
import { CatalogIcon, CustomTooltip } from '@layer5/sistent';
import { UsesSistent } from './SistentWrapper';
import ExtensionPointSchemaValidator from '../utils/ExtensionPointSchemaValidator';
import {
  updatepagetitle,
  updatebetabadge,
  toggleDrawer,
  setAdapter,
  updateCapabilities,
} from '../lib/store';
import {
  cursorNotAllowed,
  disabledStyle,
  disabledStyleWithOutOpacity,
} from '../css/disableComponent.styles';
import { CapabilitiesRegistry } from '../utils/disabledComponents';
import {
  DESIGN,
  CONFIGURATION,
  DASHBOARD,
  CATALOG,
  FILTER,
  LIFECYCLE,
  SERVICE_MESH,
  PERFORMANCE,
  PROFILES,
  TOGGLER,
  CONNECTION,
  ENVIRONMENT,
  WORKSPACE,
} from '../constants/navigator';
import { iconSmall } from '../css/icons.styles';
import CAN from '@/utils/can';
import { keys } from '@/utils/permission_constants';
import { CustomTextTooltip } from './MesheryMeshInterface/PatternService/CustomTextTooltip';
import { useGetProviderCapabilitiesQuery } from '@/rtk-query/user';
import { useGetVersionDetailsQuery } from '@/rtk-query/system';

const styles = (theme) => ({
  root: {
    '& svg': {
      width: '1.21rem',
      height: '1.21rem',
    },
  },
  categoryHeader: {
    paddingTop: 16,
    paddingBottom: 16,
  },
  categoryHeaderPrimary: { color: theme.palette.common.white },
  item: {
    paddingTop: 4,
    paddingBottom: 4,
    color: 'rgba(255, 255, 255, 0.7)',
    fill: '#fff',
    '&:hover': {
      '& $expandMoreIcon': {
        opacity: 1,
        transition: 'opacity 200ms ease-in',
      },
    },
  },
  itemCategory: {
    backgroundColor: '#263238',
    boxShadow: '0 -1px 0 #404854 inset',
    paddingTop: '1.325rem',
    paddingBottom: '1.325rem',
  },
  firebase: {
    top: 0,
    position: 'sticky',
    zIndex: 5,
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '30px',
  },

  itemActionable: { '&:hover': { backgroundColor: 'rgb(0, 187, 166, 0.5)' } },
  itemActiveItem: {
    color: '#4fc3f7',
    fill: '#4fc3f7',
  },
  itemPrimary: {
    color: 'inherit',
    fontSize: theme.typography.fontSize,
    '&$textDense': { fontSize: theme.typography.fontSize },
  },
  textDense: {},
  divider: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  mainLogo: {
    marginRight: theme.spacing(1),
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(-1),
    width: 40,
    height: 40,
    borderRadius: 'unset',
  },
  mainLogoText: {
    marginLeft: theme.spacing(0.5),
    marginTop: theme.spacing(1),
    width: 170,
    borderRadius: 'unset',
  },
  mainLogoCollapsed: {
    marginRight: theme.spacing(1),
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(-0.5),
    width: 40,
    height: 40,
    borderRadius: 'unset',
  },
  mainLogoTextCollapsed: {
    marginLeft: theme.spacing(1),
    marginTop: theme.spacing(1),
    width: 170,
    borderRadius: 'unset',
  },
  settingsIcon: { marginLeft: theme.spacing(2) },
  cursorPointer: { cursor: 'pointer' },
  listIcon: {
    minWidth: theme.spacing(3.5),
    paddingTop: theme.spacing(0.5),
    textAlign: 'center',
    display: 'inline-table',
    paddingRight: theme.spacing(0.5),
    marginLeft: theme.spacing(0.8),
  },
  listIcon1: {
    minWidth: theme.spacing(3.5),
    paddingTop: theme.spacing(0.5),
    textAlign: 'center',
    display: 'inline-table',
    paddingRight: theme.spacing(0.5),
    opacity: 0.5,
  },
  listIconSlack: {
    minWidth: theme.spacing(3.5),
    paddingTop: theme.spacing(0.5),
    textAlign: 'center',
    display: 'inline-table',
    marginLeft: theme.spacing(-0.1),
    paddingRight: theme.spacing(0.5),
    opacity: 0.5,
  },
  nested1: { paddingLeft: theme.spacing(3) },
  nested2: { paddingLeft: theme.spacing(5) },
  icon: { width: theme.spacing(2.5) },
  istioIcon: { width: theme.spacing(1.8) },
  isHidden: {
    opacity: 0,
    transition: 'opacity 200ms ease-in-out',
  },
  isDisplayed: {
    opacity: 1,
    transition: 'opacity 200ms ease-in-out',
  },
  sidebarCollapsed: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(8) + 4,
  },
  sidebarExpanded: {
    width: '256px',
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  fixedSidebarFooter: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: 'auto',
    marginBottom: '0.5rem',
  },
  collapseButtonWrapper: {
    boxShadow:
      '0.5px 0px 0px 0px rgb(0 0 0 / 20%), 1.5px 0px 0px 0px rgb(0 0 0 / 14%), 2.5px 1px 3px 0px rgb(0 0 0 / 12%)',
    borderRadius: '0 5px 5px 0',
    position: 'fixed',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    bottom: '12%',
    left: '257px',
    zIndex: '1400',
    width: 'auto',
    transition: 'left 195ms',
    '&:hover': {
      opacity: 1,
      background: 'transparent',
    },
    '&:focus': {
      opacity: 1,
      background: 'transparent',
    },
  },
  collapseButtonWrapperRotated: {
    backgroundColor: '#515b60',
    color: '#ffffff',
    position: 'fixed',
    borderRadius: '0 5px 5px 0',
    cursor: 'pointer',
    bottom: '12%',
    left: '49px',
    zIndex: '1400',
    width: 'auto',
    transition: 'left 225ms',
    transform: 'rotate(180deg)',
    display: 'flex',
    justifyContent: 'center',

    '&:hover': { opacity: 1 },
    '&:focus': { opacity: 1 },
  },
  noPadding: {
    paddingLeft: '16px',
    paddingRight: '16px',
  },
  drawerIcons: {
    height: '1.21rem',
    width: '1.21rem',
    fontSize: '1.21rem',
  },
  avatarGroup: { '& .MuiAvatarGroup-avatar': { border: 'none' } },
  marginLeft: {
    padding: '5px',
    '& > li': {
      padding: '0',
    },
  },
  rightMargin: { marginRight: 8 },
  btnGrpMarginRight: {
    marginRight: 4,
    alignItems: 'center',
  },
  helpIcon: {
    color: '#fff',
    opacity: '0.7',
    transition: 'opacity 200ms linear',
    '&:hover': {
      opacity: 1,
      background: 'transparent',
    },
    '&:focus': {
      opacity: 1,
      background: 'transparent',
    },
  },
  extraPadding: {
    // paddingTop : 4,
    // paddingBottom : 4,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  restrictPointer: { pointerEvents: 'none' },
  expandMoreIcon: {
    opacity: 0,
    cursor: 'pointer',
    transform: 'translateX(3px)',
    '&:hover': { color: '#4fc3f7' },
  },
  collapsed: { transform: 'rotate(180deg) translateX(-0.8px)' },
  collapsedHelpButton: {
    height: '1.45rem',
    marginTop: '-4px',
    transform: 'translateX(0px)',
  },
  rightTranslate: { transform: 'translateX(0.5px)' },
  hideScrollbar: {
    overflow: 'hidden auto',
    'scrollbar-width': 'none',
    '-ms-overflow-style': 'none',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
  disabled: disabledStyle,
  disableLogo: disabledStyleWithOutOpacity,
  cursorNotAllowed: cursorNotAllowed,
});

const drawerIconsStyle = { height: '1.21rem', width: '1.21rem', fontSize: '1.45rem', ...iconSmall };
const externalLinkIconStyle = { width: '1.11rem', fontSize: '1.11rem' };

const getNavigatorComponents = (/** @type {CapabilitiesRegistry} */ capabilityRegistryObj) => [
  {
    id: DASHBOARD,
    icon: <DashboardIcon style={drawerIconsStyle} />,
    hovericon: <DashboardIcon style={drawerIconsStyle} />,
    href: '/',
    title: 'Dashboard',
    show: capabilityRegistryObj.isNavigatorComponentEnabled([DASHBOARD]),
    link: true,
    submenu: true,
  },
  {
    id: LIFECYCLE,
    icon: <LifecycleIcon style={drawerIconsStyle} />,
    hovericon: <LifecycleHover style={drawerIconsStyle} />,
    title: 'Lifecycle',
    link: true,
    href: '/management/connections',
    show: capabilityRegistryObj.isNavigatorComponentEnabled([LIFECYCLE]),
    submenu: true,
    children: [
      {
        id: CONNECTION,
        href: '/management/connections',
        title: 'Connections',
        show: capabilityRegistryObj.isNavigatorComponentEnabled([LIFECYCLE, CONNECTION]),
        link: true,
        permission: {
          action: keys.VIEW_CONNECTIONS.action,
          subject: keys.VIEW_CONNECTIONS.subject,
        },
      },
      {
        id: ENVIRONMENT,
        href: '/management/environments',
        title: 'Environments',
        show: capabilityRegistryObj.isNavigatorComponentEnabled([LIFECYCLE, ENVIRONMENT]),
        link: true,
        permission: {
          action: keys.VIEW_ENVIRONMENTS.action,
          subject: keys.VIEW_ENVIRONMENTS.subject,
        },
      },
      {
        id: WORKSPACE,
        href: '/management/workspaces',
        title: 'Workspaces',
        show: capabilityRegistryObj.isNavigatorComponentEnabled([LIFECYCLE, WORKSPACE]),
        link: true,
        permission: {
          action: keys.VIEW_WORKSPACE.action,
          subject: keys.VIEW_WORKSPACE.subject,
        },
      },
      {
        id: SERVICE_MESH,
        href: '/management/service-mesh',
        title: 'Adapters',
        link: true,
        icon: <ServiceMeshIcon style={{ ...drawerIconsStyle }} />,
        show: true,
        permission: {
          action: keys.VIEW_SERVICE_MESH.action,
          subject: keys.VIEW_SERVICE_MESH.subject,
        },
      },
    ],
  },
  {
    id: CONFIGURATION,
    icon: <ConfigurationIcon {...drawerIconsStyle} />,
    hovericon: <ConfigurationHover style={drawerIconsStyle} />,
    href: '/configuration/designs',
    title: 'Configuration',
    show: capabilityRegistryObj.isNavigatorComponentEnabled([CONFIGURATION]),
    link: true,
    submenu: true,
    children: [
      {
        id: CATALOG,
        icon: (
          <UsesSistent>
            <CatalogIcon
              primaryFill="#FFFFFF"
              secondaryFill="#FFFFFFb3"
              tertiaryFill="transparent"
              style={{ ...drawerIconsStyle }}
            />
          </UsesSistent>
        ),
        href: '/configuration/catalog',
        title: 'Catalog',
        show: capabilityRegistryObj.isNavigatorComponentEnabled([CONFIGURATION, CATALOG]),
        link: true,
        isBeta: true,
        permission: {
          action: keys.VIEW_CATALOG.action,
          subject: keys.VIEW_CATALOG.subject,
        },
      },
      {
        id: FILTER,
        icon: <FilterIcon style={{ ...drawerIconsStyle }} />,
        href: '/configuration/filters',
        title: 'Filters',
        show: capabilityRegistryObj.isNavigatorComponentEnabled([CONFIGURATION, FILTER]),
        link: true,
        isBeta: true,
        permission: {
          action: keys.VIEW_FILTERS.action,
          subject: keys.VIEW_FILTERS.subject,
        },
      },
      {
        id: DESIGN,
        icon: <PatternIcon style={{ ...drawerIconsStyle }} />,
        href: '/configuration/designs',
        title: 'Designs',
        show: capabilityRegistryObj.isNavigatorComponentEnabled([CONFIGURATION, DESIGN]),
        link: true,
        isBeta: true,
        permission: {
          action: keys.VIEW_DESIGNS.action,
          subject: keys.VIEW_DESIGNS.subject,
        },
      },
    ],
  },
  {
    id: PERFORMANCE,
    icon: <PerformanceIcon style={{ transform: 'scale(1.3)', ...drawerIconsStyle }} />,
    hovericon: <PerformanceHover style={drawerIconsStyle} />,
    href: '/performance',
    title: 'Performance',
    show: capabilityRegistryObj.isNavigatorComponentEnabled([PERFORMANCE]),
    link: true,
    submenu: true,
    children: [
      {
        id: PROFILES,
        icon: <FontAwesomeIcon icon={faDigitalTachograph} style={{ fontSize: 24 }} />,
        href: '/performance/profiles',
        title: 'Profiles',
        show: capabilityRegistryObj.isNavigatorComponentEnabled([PERFORMANCE, PROFILES]),
        link: true,
        permission: {
          action: keys.VIEW_PERFORMANCE_PROFILES.action,
          subject: keys.VIEW_PERFORMANCE_PROFILES.subject,
        },
      },
    ],
  },
  {
    id: 'Extensions',
    icon: <ExtensionIcon style={drawerIconsStyle} />,
    hovericon: <ExtensionIcon style={drawerIconsStyle} />,
    title: 'Extensions',
    show: capabilityRegistryObj.isNavigatorComponentEnabled(['Extensions']),
    width: 12,
    link: true,
    href: '/extensions',
    submenu: false,
    permission: {
      action: keys.VIEW_EXTENSIONS.action,
      subject: keys.VIEW_EXTENSIONS.subject,
    },
  },
];

const ExternalLinkIcon = (
  <FontAwesomeIcon style={externalLinkIconStyle} icon={faExternalLinkAlt} transform="shrink-7" />
);

const externlinks = [
  {
    id: 'doc',
    href: 'https://docs.meshery.io',
    title: 'Documentation',
    icon: <DocumentIcon style={drawerIconsStyle} />,
    external_icon: ExternalLinkIcon,
  },
  {
    id: 'community',
    href: 'https://slack.meshery.io',
    title: 'Community',
    icon: (
      <SlackIcon
        style={{ ...drawerIconsStyle, height: '1.5rem', width: '1.5rem', marginTop: '' }}
      />
    ),
    external_icon: ExternalLinkIcon,
  },
  {
    id: 'forum',
    href: 'http://discuss.meshery.io',
    title: 'Discussion Forum',
    icon: <ChatIcon style={drawerIconsStyle} />,
    external_icon: ExternalLinkIcon,
  },
  {
    id: 'issues',
    href: 'https://github.com/meshery/meshery/issues/new/choose',
    title: 'Issues',
    icon: <GithubIcon style={drawerIconsStyle} />,
    external_icon: ExternalLinkIcon,
  },
];

const Navigator = ({
  meshAdapters,
  updateCapabilities,
  classes,
  isDrawerCollapsed,
  updateExtensionType,
  catalogVisibility,
  meshAdaptersts,
  updatepagetitle,
  updatebetabadge,
  router,
  setAdapter,
  toggleDrawer,
  capabilitiesRegistry,
}) => {
  const path = window.location.pathname;
  const navigatorSchema = ExtensionPointSchemaValidator('navigator');
  const [navigator, setNavigator] = useState(navigatorSchema);
  const [capabilitiesRegistryObj, setCapabilitiesRegistryObj] = useState(null);
  const [navigatorComponents, setNavigatorComponents] = useState([]);
  const [versionDetail, setversionDetail] = useState({
    build: '',
    latest: '',
    outdated: false,
    commitsha: '',
    release_channel: 'NA',
  });
  const [showHelperButton, setShowHelperButton] = useState(false);
  const [openItems, setOpenItems] = useState([]);
  const [hoveredId, setHoveredId] = useState(null);
  const [mts, setMts] = useState(new Date());

  const {
    data: capabilitiesData,
    isSuccess: fetchedCapabilities,
    isError: isCapabilitiesError,
    error: capabilitiesError,
  } = useGetProviderCapabilitiesQuery();

  const {
    data: versionDetailsData,
    isSuccess: fetchedVersionDetails,
    isError: isVersionDetailsError,
    error: versionDetailsError,
  } = useGetVersionDetailsQuery();

  useEffect(() => {
    fetchCapabilities();
    fetchVersionDetails();
  }, [capabilitiesData, versionDetailsData]);

  useEffect(() => {
    updatenavigatorComponentsMenus();
  }, [navigatorComponents]);

  const fetchCapabilities = () => {
    if (fetchedCapabilities && capabilitiesData) {
      const capabilitiesRegistryObj = new CapabilitiesRegistry(capabilitiesData);
      const navigatorComponents = createNavigatorComponents(capabilitiesRegistryObj);
      setNavigator(
        ExtensionPointSchemaValidator('navigator')(capabilitiesData?.extensions?.navigator),
      );
      setCapabilitiesRegistryObj(capabilitiesRegistryObj);
      setNavigatorComponents(navigatorComponents);
      updateCapabilities({ capabilitiesRegistry: capabilitiesData });
    } else if (isCapabilitiesError) {
      console.log(capabilitiesError);
    }
  };

  const fetchVersionDetails = () => {
    if (fetchedVersionDetails && versionDetailsData) {
      setversionDetail(
        versionDetailsData || {
          build: 'Unknown',
          latest: 'Unknown',
          outdated: false,
          commitsha: 'Unknown',
        },
      );
    } else if (isVersionDetailsError) {
      console.log(versionDetailsError);
    }
  };

  const createNavigatorComponents = (capabilityRegistryObj) => {
    return getNavigatorComponents(capabilityRegistryObj);
  };

  /**
   * @param {import("../utils/ExtensionPointSchemaValidator").NavigatorSchema[]} children
   * @param {number} depth
   */
  const renderNavigatorExtensions = (children, depth) => {
    if (children && children.length > 0) {
      return (
        <List disablePadding>
          {children.map(({ id, icon, href, title, children, show: showc }) => {
            if (typeof showc !== 'undefined' && !showc) {
              return '';
            }
            return (
              <React.Fragment key={id}>
                <ListItem
                  button
                  key={id}
                  className={classNames(
                    depth === 1 ? '' : classes.nested1,
                    classes.item,
                    classes.itemActionable,
                    path === href && classes.itemActiveItem,
                    isDrawerCollapsed && classes.noPadding,
                  )}
                >
                  {extensionPointContent(icon, href, title, isDrawerCollapsed)}
                </ListItem>
                {renderNavigatorExtensions(children, depth + 1)}
              </React.Fragment>
            );
          })}
        </List>
      );
    }
  };

  const extensionPointContent = (icon, href, name, drawerCollapsed) => {
    let content = (
      <div className={classNames(classes.link)} data-cy={name}>
        <CustomTooltip
          title={name}
          placement="right"
          disableFocusListener={!drawerCollapsed}
          disableTouchListener={!drawerCollapsed}
        >
          <ListItemIcon className={classes.listIcon}>
            <img
              src={icon}
              className={classes.icon}
              onMouseOver={(e) => {
                e.target.style.transform = 'translate(-20%, -25%)';
                e.target.style.top = '0';
                e.target.style.right = '0';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translate(0, 0)';
                e.target.style.top = 'auto';
                e.target.style.right = 'auto';
              }}
            />
          </ListItemIcon>
        </CustomTooltip>
        <ListItemText
          className={drawerCollapsed ? classes.isHidden : classes.isDisplayed}
          classes={{ primary: classes.itemPrimary }}
        >
          {name}
        </ListItemText>
      </div>
    );

    if (href) {
      content = (
        <Link href={href}>
          <span
            className={classNames(classes.link)}
            onClick={() => updateExtensionType('navigator')}
          >
            {content}
          </span>
        </Link>
      );
    }

    return content;
  };

  const updatenavigatorComponentsMenus = () => {
    navigatorComponents.forEach((cat, ind) => {
      if (cat.id === LIFECYCLE) {
        cat.children.forEach((catc, ind1) => {
          if (catc.id == SERVICE_MESH) {
            return;
          }
          const icon = pickIcon(catc.id, catc.href);
          navigatorComponents[ind].children[ind1].icon = icon;

          const cr = fetchChildren(catc.id);
          navigatorComponents[ind].children[ind1].children = cr;
        });
      }

      if (cat.id === 'Configuration') {
        let show = false;
        cat.children?.forEach((ch) => {
          if (ch.id === 'Designs') {
            const idx = capabilitiesRegistry?.capabilities?.findIndex(
              (cap) => cap.feature === 'persist-meshery-patterns',
            );
            if (idx != -1) {
              ch.show = true;
              show = true;
            }
          }
        });
        cat.show = show;
      }

      //To Toggle Catalog Extension
      if (cat.id === CONFIGURATION) {
        cat.children?.forEach((ch) => {
          if (ch.id === CATALOG) {
            ch.show = catalogVisibility;
          }
        });
      }
    });
  };

  const updateAdaptersLink = () => {
    const updatedNavigatorComponents = [...navigatorComponents];
    updatedNavigatorComponents.forEach((cat, ind) => {
      if (cat.id === LIFECYCLE) {
        cat.children.forEach((catc, ind1) => {
          if (
            typeof updatedNavigatorComponents[ind].children[ind1].children[0] !== 'undefined' &&
            typeof updatedNavigatorComponents[ind].children[ind1].children[0].href !== 'undefined'
          ) {
            const val = true;
            const newhref = `${updatedNavigatorComponents[ind].children[ind1].children[0].href}`;
            updatedNavigatorComponents[ind].children[ind1].link = val;
            updatedNavigatorComponents[ind].children[ind1].href = newhref;
          }
        });
      }
    });
    setNavigatorComponents(updatedNavigatorComponents);
  };

  useEffect(() => {
    const path = window.location.pathname;

    if (meshAdaptersts > mts) {
      setMts(meshAdaptersts);
    }

    const fetchNestedPathAndTitle = (currentPath, title, href, children, isBeta) => {
      if (href === currentPath) {
        updatepagetitle({ title });
        updatebetabadge({ isBeta });
        return;
      }
      if (children && children.length > 0) {
        children.forEach(({ title, href, children, isBeta }) => {
          fetchNestedPathAndTitle(currentPath, title, href, children, isBeta);
        });
      }
    };

    navigatorComponents.forEach(({ title, href, children, isBeta }) => {
      fetchNestedPathAndTitle(path, title, href, children, isBeta);
    });
  }, [navigatorComponents, mts]);

  /**
   * @param {String} category
   *
   * Format and return the meshadapters
   *
   * @returns {Array<{id : Number, icon : JSX.Element, href : String, title : String, link : Boolean, show : Boolean}>} children
   */
  const fetchChildren = (category) => {
    const children = [];
    category = category.toLowerCase();
    meshAdapters.forEach((adapter) => {
      let aName = adapter.name.toLowerCase();
      if (category !== aName) {
        return;
      }
      children.push({
        id: adapter.adapter_location,
        icon: <RemoveIcon />,
        href: `/management?adapter=${adapter.adapter_location}`,
        title: `Management - ${adapter.adapter_location}`,
        link: true,
        show: true,
      });
    });
    return children;
  };

  /**
   * @param {String} aName
   *
   * @returns {JSX.Element} image to display
   */
  const pickIcon = (aName, href) => {
    aName = aName.toLowerCase();
    let image = '/static/img/meshery-logo.png';
    let filter =
      window.location.pathname === href
        ? 'invert(50%) sepia(78%) saturate(2392%) hue-rotate(160deg) brightness(93%) contrast(101%)'
        : '';
    let logoIcon = <img src={image} className={classes.icon} />;
    if (aName) {
      image = '/static/img/' + aName + '-light.svg';
      logoIcon = <img src={image} className={classes.icon} style={{ filter: filter }} />;
    }
    return logoIcon;
  };

  /**
   * Changes the route to "/"
   */
  const handleTitleClick = () => {
    router.push('/');
  };

  /**
   * @param {number} id
   * @param {Boolean link
   *
   * Changes the route to "/management"
   */
  const handleAdapterClick = (id, link) => {
    setAdapter(id);
    if (id != -1 && !link) {
      router.push('/management');
    }
  };

  const toggleMiniDrawer = () => {
    toggleDrawer({ isDrawerCollapsed: !isDrawerCollapsed });
  };

  const toggleSpacing = () => {
    setShowHelperButton((p) => !p);
  };

  /**
   * @param {number} id
   *
   * Removes id from openitems if present
   * Adds id in openitems if not present already
   */
  const toggleItemCollapse = (itemId) => {
    const isItemOpen = openItems.includes(itemId);
    const activeItems = [...openItems];
    if (isItemOpen) {
      const filteredItems = activeItems.filter((item) => item !== itemId);
      setOpenItems(filteredItems);
    } else {
      activeItems.push(itemId);
      setOpenItems([itemId]);
    }
  };

  /**
   * @param {String} idname
   * @param {Array<{id : Number, icon : JSX.Element, href : String, title : String, link : Boolean, show : Boolean}>} children
   * @param {Number} depth
   *
   * Renders children of the menu
   *
   * @returns {JSX.Element}
   */
  const renderChildren = (idname, children, depth) => {
    if (idname != LIFECYCLE && children && children.length > 0) {
      return (
        <List disablePadding>
          {children.map(
            ({
              id: idc,
              title: titlec,
              icon: iconc,
              href: hrefc,
              show: showc,
              link: linkc,
              children: childrenc,
              permission: permissionc,
            }) => {
              if (typeof showc !== 'undefined' && !showc) {
                return '';
              }
              return (
                <div key={idc}>
                  <ListItem
                    button
                    key={idc}
                    className={classNames(
                      depth === 1 ? classes.nested1 : classes.nested2,
                      classes.item,
                      classes.itemActionable,
                      path === hrefc && classes.itemActiveItem,
                      isDrawerCollapsed && classes.noPadding,
                    )}
                    disabled={permissionc ? !CAN(permissionc.action, permissionc.subject) : false}
                  >
                    {linkContent(iconc, titlec, hrefc, linkc, isDrawerCollapsed)}
                  </ListItem>
                  {renderChildren(idname, childrenc, depth + 1)}
                </div>
              );
            },
          )}
        </List>
      );
    }
    if (idname == LIFECYCLE) {
      if (children && children.length > 0) {
        return (
          <List disablePadding>
            {children.map(
              ({
                id: idc,
                title: titlec,
                icon: iconc,
                href: hrefc,
                show: showc,
                link: linkc,
                children: childrenc,
                permission: permissionc,
              }) => {
                if (typeof showc !== 'undefined' && !showc) {
                  return '';
                }
                return (
                  <div key={idc} className={!showc ? classes.cursorNotAllowed : null}>
                    <ListItem
                      data-cy={idc}
                      button
                      key={idc}
                      className={classNames(
                        depth === 1 ? classes.nested1 : classes.nested2,
                        classes.item,
                        classes.itemActionable,
                        path === hrefc && classes.itemActiveItem,
                        isDrawerCollapsed && classes.noPadding,
                        !showc && classes.disabled,
                      )}
                      onClick={() => handleAdapterClick(idc, linkc)}
                      disabled={permissionc ? !CAN(permissionc.action, permissionc.subject) : false}
                    >
                      {linkContent(iconc, titlec, hrefc, linkc, isDrawerCollapsed)}
                    </ListItem>
                    {renderChildren(idname, childrenc, depth + 1)}
                  </div>
                );
              },
            )}
          </List>
        );
      }
      if (children && children.length === 1) {
        updateAdaptersLink();
      }
    }
    return '';
  };

  /**
   * @param {JSX.Element} iconc
   * @param {String} titlec
   * @param {String} hrefc
   * @param {Boolean} linkc
   * @param {Boolean} drawerCollapsed
   *
   * @return {JSX.Element} content
   */
  const linkContent = (iconc, titlec, hrefc, linkc, drawerCollapsed) => {
    let linkContent = (
      <div className={classNames(classes.link)}>
        <CustomTooltip
          title={titlec}
          placement="right"
          disableFocusListener={!drawerCollapsed}
          disableHoverListener={!drawerCollapsed}
          disableTouchListener={!drawerCollapsed}
        >
          <ListItemIcon className={classes.listIcon}>{iconc} </ListItemIcon>
        </CustomTooltip>
        <ListItemText
          className={drawerCollapsed ? classes.isHidden : classes.isDisplayed}
          classes={{ primary: classes.itemPrimary }}
        >
          {titlec}
        </ListItemText>
      </div>
    );
    if (linkc) {
      linkContent = <Link href={hrefc}>{linkContent}</Link>;
    }
    return linkContent;
  };

  /**
   * getMesheryVersionText returs a well formatted version text
   *
   * If the meshery is running latest version then and is using "edge" channel
   * then it will just show "edge-latest". However, if the meshery is on edge and
   * is running an outdated version then it will return "edge-$version".
   *
   * If on stable channel, then it will always show "stable-$version"
   */
  const getMesheryVersionText = () => {
    const { build, outdated, release_channel } = versionDetail;

    // If the version is outdated then no matter what the
    // release channel is, specify the build which gets covered in the default case

    if (release_channel === 'edge' && outdated) return `${build}`;
    //if it is not outdated which means running on latest, return edge-latest

    if (release_channel === 'edge' && !outdated) return `${release_channel}-latest`;

    if (release_channel === 'stable') return `${release_channel}-${build}`;

    return `${build}`;
  };

  /**
   * versionUpdateMsg returns the appropriate message
   * based on the meshery's current running version and latest available
   * version.
   *
   * @returns {React.ReactNode} react component to display
   */
  const versionUpdateMsg = () => {
    const { outdated, latest } = versionDetail;

    if (outdated)
      return (
        <span style={{ marginLeft: '15px' }}>
          {'Update available '}
          <a
            href={`https://docs.meshery.io/project/releases/${latest}`}
            target="_blank"
            rel="noreferrer"
            style={{ color: 'white' }}
          >
            <CustomTextTooltip
              title={`Newer version of Meshery available: ${latest}`}
              placement="right"
            >
              <OpenInNewIcon style={{ width: '0.85rem', verticalAlign: 'middle' }} />
            </CustomTextTooltip>
          </a>
        </span>
      );

    return <span style={{ marginLeft: '15px' }}>Running latest</span>;
  };

  /**
   * openReleaseNotesInNew returns the appropriate link to the release note
   * based on the meshery's current running channel and version.
   *
   * @returns {React.ReactNode} react component to display
   */
  const openReleaseNotesInNew = () => {
    const { release_channel, build } = versionDetail;

    if (release_channel === 'edge')
      return (
        <a
          href="https://docs.meshery.io/project/releases"
          target="_blank"
          rel="noreferrer"
          style={{ color: 'white' }}
        >
          <OpenInNewIcon style={{ width: '0.85rem', verticalAlign: 'middle' }} />
        </a>
      );

    return (
      <a
        href={`https://docs.meshery.io/project/releases/${build}`}
        target="_blank"
        rel="noreferrer"
        style={{ color: 'white' }}
      >
        <OpenInNewIcon style={{ width: '0.85rem', verticalAlign: 'middle' }} />
      </a>
    );
  };

  const Title = (
    <div
      style={
        !capabilitiesRegistryObj?.isNavigatorComponentEnabled([DASHBOARD]) ? cursorNotAllowed : {}
      }
    >
      <ListItem
        component="a"
        onClick={handleTitleClick}
        className={classNames(
          classes.firebase,
          classes.item,
          classes.itemCategory,
          classes.cursorPointer,
          !capabilitiesRegistryObj?.isNavigatorComponentEnabled([DASHBOARD]) && classes.disableLogo,
        )}
      >
        <img
          className={isDrawerCollapsed ? classes.mainLogoCollapsed : classes.mainLogo}
          src="/static/img/meshery-logo.png"
          onClick={handleTitleClick}
        />
        <img
          className={isDrawerCollapsed ? classes.mainLogoTextCollapsed : classes.mainLogoText}
          src="/static/img/meshery-logo-text.png"
          onClick={handleTitleClick}
        />
      </ListItem>
    </div>
  );

  const Menu = (
    <List disablePadding className={classes.hideScrollbar}>
      {navigatorComponents.map(
        ({
          id: childId,
          title,
          icon,
          href,
          show,
          link,
          children,
          hovericon,
          submenu,
          permission,
        }) => {
          return (
            <div key={childId} style={!show ? cursorNotAllowed : {}} className={classes.root}>
              <ListItem
                button={!!link}
                dense
                key={childId}
                className={classNames(
                  classes.item,
                  link ? classes.itemActionable : '',
                  path === href && classes.itemActiveItem,
                  !show && classes.disabled,
                )}
                onClick={() => toggleItemCollapse(childId)}
                onMouseOver={() => (isDrawerCollapsed ? setHoveredId(childId) : null)}
                onMouseLeave={() =>
                  !submenu || !openItems.includes(childId) ? setHoveredId(null) : null
                }
                disabled={permission ? !CAN(permission.action, permission.subject) : false}
              >
                <Link href={link ? href : ''}>
                  <div data-cy={childId} className={classNames(classes.link)}>
                    <CustomTooltip
                      title={childId}
                      placement="right"
                      disableFocusListener={!isDrawerCollapsed}
                      disableHoverListener={true}
                      disableTouchListener={!isDrawerCollapsed}
                      TransitionComponent={Zoom}
                    >
                      {isDrawerCollapsed &&
                      (hoveredId === childId || (openItems.includes(childId) && submenu)) ? (
                        <div>
                          <CustomTooltip title={title} placement="right" TransitionComponent={Zoom}>
                            <ListItemIcon
                              onClick={() => toggleItemCollapse(childId)}
                              style={{ marginLeft: '20%', marginBottom: '0.4rem' }}
                            >
                              {hovericon}
                            </ListItemIcon>
                          </CustomTooltip>
                        </div>
                      ) : (
                        <ListItemIcon className={classes.listIcon}>{icon}</ListItemIcon>
                      )}
                    </CustomTooltip>
                    <ListItemText
                      className={isDrawerCollapsed ? classes.isHidden : classes.isDisplayed}
                      classes={{ primary: classes.itemPrimary }}
                    >
                      {title}
                    </ListItemText>
                  </div>
                </Link>
                <FontAwesomeIcon
                  icon={faCaretDown}
                  onClick={() => toggleItemCollapse(childId)}
                  className={classNames(classes.expandMoreIcon, {
                    [classes.collapsed]: openItems.includes(childId),
                  })}
                  style={isDrawerCollapsed || !children ? { opacity: 0 } : {}}
                />
              </ListItem>
              <Collapse
                in={openItems.includes(childId)}
                style={{ backgroundColor: '#396679', opacity: '100%' }}
              >
                {renderChildren(childId, children, 1)}
              </Collapse>
            </div>
          );
        },
      )}
      {navigator && navigator.length ? (
        <React.Fragment>
          <Divider className={classes.divider} />
          {renderNavigatorExtensions(navigator, 1)}
        </React.Fragment>
      ) : null}
      <Divider className={classes.divider} />
    </List>
  );

  const HelpIcons = (
    <ButtonGroup
      size="large"
      className={!isDrawerCollapsed ? classes.marginLeft : classes.btnGrpMarginRight}
      orientation={isDrawerCollapsed ? 'vertical' : 'horizontal'}
    >
      {externlinks.map(({ id, icon, title, href }, index) => {
        return (
          <ListItem
            key={id}
            className={classes.item}
            style={isDrawerCollapsed && !showHelperButton ? { display: 'none' } : {}}
          >
            <Grow
              in={showHelperButton || !isDrawerCollapsed}
              timeout={{ enter: 600 - index * 200, exit: 100 * index }}
            >
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                className={classNames(classes.link, isDrawerCollapsed ? classes.extraPadding : '')}
              >
                <CustomTextTooltip title={title} placement={isDrawerCollapsed ? 'right' : 'top'}>
                  <ListItemIcon className={classNames(classes.listIcon, classes.helpIcon)}>
                    {icon}
                  </ListItemIcon>
                </CustomTextTooltip>
              </a>
            </Grow>
          </ListItem>
        );
      })}
      <ListItem
        className={classes.rightMargin}
        style={!isDrawerCollapsed ? { display: 'none' } : { marginLeft: '4px' }}
      >
        <CustomTextTooltip title="Help" placement={isDrawerCollapsed ? 'right' : 'top'}>
          <IconButton
            className={isDrawerCollapsed ? classes.collapsedHelpButton : classes.rightTranslate}
            onClick={toggleSpacing}
          >
            <HelpIcon className={classes.helpIcon} style={{ fontSize: '1.45rem', ...iconSmall }} />
          </IconButton>
        </CustomTextTooltip>
      </ListItem>
    </ButtonGroup>
  );

  const Version = (
    <ListItem
      style={{
        position: 'sticky',
        paddingLeft: 0,
        paddingRight: 0,
        color: '#eeeeee',
        fontSize: '0.75rem',
      }}
    >
      {isDrawerCollapsed ? (
        <div style={{ textAlign: 'center', width: '100%' }}>{versionDetail.build}</div>
      ) : (
        <Grow
          in={!isDrawerCollapsed}
          timeout={{ enter: 800, exit: 100 }}
          style={{ textAlign: 'center', width: '100%' }}
        >
          <span>
            {getMesheryVersionText()} {'  '}
            <span style={{ cursor: 'pointer' }}>{openReleaseNotesInNew()}</span>
            {versionUpdateMsg()}
          </span>
        </Grow>
      )}
    </ListItem>
  );

  const Chevron = (
    <div
      className={classNames(
        isDrawerCollapsed ? classes.collapseButtonWrapperRotated : classes.collapseButtonWrapper,
      )}
      style={
        capabilitiesRegistryObj?.isNavigatorComponentEnabled?.([TOGGLER]) ? {} : cursorNotAllowed
      }
    >
      <div
        style={
          capabilitiesRegistryObj?.isNavigatorComponentEnabled?.([TOGGLER]) ? {} : disabledStyle
        }
        onClick={toggleMiniDrawer}
      >
        <FontAwesomeIcon
          icon={faAngleLeft}
          fixedWidth
          size="2x"
          style={{ margin: '0.75rem 0.2rem ', width: '0.8rem', verticalAlign: 'middle' }}
          alt="Sidebar collapse toggle icon"
        />
      </div>
    </div>
  );

  return (
    <NoSsr>
      <Drawer
        variant="permanent"
        // {...other} //TODO
        className={isDrawerCollapsed ? classes.sidebarCollapsed : classes.sidebarExpanded}
        classes={{
          paper: isDrawerCollapsed ? classes.sidebarCollapsed : classes.sidebarExpanded,
        }}
        style={{ height: '100%' }}
      >
        {Title}
        {Menu}
        <div className={classes.fixedSidebarFooter}>
          {Chevron}
          {HelpIcons}
          {Version}
        </div>
      </Drawer>
    </NoSsr>
  );
};

Navigator.propTypes = {
  classes: PropTypes.object.isRequired,
  onCollapseDrawer: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  updatepagetitle: bindActionCreators(updatepagetitle, dispatch),
  updatebetabadge: bindActionCreators(updatebetabadge, dispatch),
  toggleDrawer: bindActionCreators(toggleDrawer, dispatch),
  setAdapter: bindActionCreators(setAdapter, dispatch),
  updateCapabilities: bindActionCreators(updateCapabilities, dispatch),
});

const mapStateToProps = (state) => {
  const meshAdapters = state.get('meshAdapters').toJS();
  const meshAdaptersts = state.get('meshAdaptersts');
  const path = state.get('page').get('path');
  const isDrawerCollapsed = state.get('isDrawerCollapsed');
  const capabilitiesRegistry = state.get('capabilitiesRegistry');
  const organization = state.get('organization');
  const keys = state.get('keys');
  const catalogVisibility = state.get('catalogVisibility');
  return {
    meshAdapters,
    meshAdaptersts,
    path,
    isDrawerCollapsed,
    capabilitiesRegistry,
    organization,
    keys,
    catalogVisibility,
  };
};

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(withRouter(Navigator)),
);
