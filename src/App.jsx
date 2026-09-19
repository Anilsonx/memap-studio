import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Plus,
  Trash2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Download,
  Sparkles,
  Search,
  Layout,
  Sun,
  Moon,
  Move,
  Edit3,
  Check,
  X,
  Layers,
  Menu,
  Tag,
  Compass,
  Smartphone,
  FileText,
  Square,
  Type,
  RotateCw,
  Minus,
  DownloadCloud,
  CheckCircle2,
  HardDrive,
  FolderOpen
} from 'lucide-react';

/* Color presets for nodes */
const COLOR_PRESETS = [
  { id: 'indigo', name: 'Índigo', bg: '#e0e7ff', border: '#6366f1', text: '#3730a3', darkBg: '#312e81', darkBorder: '#818cf8', darkText: '#e0e7ff' },
  { id: 'emerald', name: 'Esmeralda', bg: '#d1fae5', border: '#10b981', text: '#065f46', darkBg: '#064e3b', darkBorder: '#34d399', darkText: '#d1fae5' },
  { id: 'amber', name: 'Âmbar', bg: '#fef3c7', border: '#f59e0b', text: '#92400e', darkBg: '#78350f', darkBorder: '#fbbf24', darkText: '#fef3c7' },
  { id: 'rose', name: 'Rosa', bg: '#ffe4e6', border: '#f43f5e', text: '#9f1239', darkBg: '#881337', darkBorder: '#fb7185', darkText: '#ffe4e6' },
  { id: 'cyan', name: 'Ciano', bg: '#cffafe', border: '#06b6d4', text: '#155e75', darkBg: '#164e63', darkBorder: '#22d3ee', darkText: '#cffafe' },
  { id: 'violet', name: 'Violeta', bg: '#ede9fe', border: '#8b5cf6', text: '#5b21b6', darkBg: '#4c1d95', darkBorder: '#a78bfa', darkText: '#ede9fe' },
];

/* 4 distinct visual display modes */
const VIEW_MODES = [
  { id: 'completo', label: 'Completo', icon: Layers, desc: 'Título, Descrição e Tags' },
  { id: 'simplificado', label: 'Simplificado', icon: FileText, desc: 'Apenas Conteúdo e Foco' },
  { id: 'sem-tag', label: 'Sem Tag', icon: Tag, desc: 'Título e Descrição limpos' },
  { id: 'sem-bordas', label: 'Sem Bordas', icon: Square, desc: 'Design Lousa / Minimalista' },
];

const NODE_WIDTH = 230;
const NODE_HEIGHT = 110;

const PRESET_TEMPLATES = {
  saas_split: {
    title: "SaaS com Split Pix e Subcontas Asaas",
    nodes: [
      { id: 'root', title: 'SaaS Split de Pagamentos', desc: 'Plataforma para Empresa de Transporte', x: 60, y: 260, color: 'indigo', tag: 'Core SaaS' },
      { id: 'n1', title: 'Empresa de Transporte', desc: 'Conta Principal / Subconta Asaas com walletId', x: 420, y: 120, color: 'emerald', tag: 'Recebedor 90%' },
      { id: 'n2', title: 'Motoristas Logados', desc: 'Geram QR Code Pix no app mobile por corrida', x: 420, y: 400, color: 'amber', tag: 'Operadores' },
      { id: 'n3', title: 'Passageiro Final', desc: 'Paga via Pix Copia e Cola instantâneo', x: 780, y: 400, color: 'cyan', tag: 'Pagador' },
      { id: 'n4', title: 'Split Instantâneo', desc: 'Divisão automática de taxas e comissões', x: 780, y: 120, color: 'violet', tag: 'Regra Asaas' },
      { id: 'n5', title: 'Conta PJ SaaS', desc: 'Sua carteira principal que recebe o split', x: 1140, y: 60, color: 'rose', tag: 'Seu Lucro' },
      { id: 'n6', title: 'Webhooks de Confirmação', desc: 'Evento PAYMENT_RECEIVED alimenta backend', x: 1140, y: 220, color: 'indigo', tag: 'Automação' },
      { id: 'n7', title: 'Relatório por Motorista', desc: 'Filtra por externalReference de cada corrida', x: 1140, y: 400, color: 'emerald', tag: 'Gestão' },
    ],
    edges: [
      { id: 'e1', from: 'root', to: 'n1', sourcePort: 'right', targetPort: 'left', label: 'Cadastrada', labelMode: 'follow' },
      { id: 'e2', from: 'root', to: 'n2', sourcePort: 'bottom', targetPort: 'left', label: 'Autentica', labelMode: 'follow' },
      { id: 'e3', from: 'n2', to: 'n3', sourcePort: 'right', targetPort: 'left', label: 'Gera Pix', labelMode: 'follow' },
      { id: 'e4', from: 'n3', to: 'n4', sourcePort: 'top', targetPort: 'bottom', label: 'Liquida', labelMode: 'follow' },
      { id: 'e5', from: 'n4', to: 'n5', sourcePort: 'right', targetPort: 'left', label: 'Comissão', labelMode: 'follow' },
      { id: 'e6', from: 'n4', to: 'n1', sourcePort: 'left', targetPort: 'right', label: 'Saldo Líquido', labelMode: 'follow' },
      { id: 'e7', from: 'n4', to: 'n6', sourcePort: 'bottom', targetPort: 'top', label: 'Notifica', labelMode: 'follow' },
      { id: 'e8', from: 'n6', to: 'n7', sourcePort: 'bottom', targetPort: 'top', label: 'Gera Métricas', labelMode: 'follow' },
    ]
  },
  marketing_plan: {
    title: "Lançamento de Produto B2B SaaS",
    nodes: [
      { id: 'root', title: 'Lançamento SaaS B2B', desc: 'Geração de Leads e Aquisição', x: 80, y: 260, color: 'violet', tag: 'Meta 100 Clientes' },
      { id: 'n1', title: 'Tráfego Pago', desc: 'Google Search & LinkedIn Ads direcionados', x: 420, y: 130, color: 'cyan', tag: 'Inbound' },
      { id: 'n2', title: 'Outbound SDR', desc: 'Prospecção fria e contatos qualificados', x: 420, y: 390, color: 'amber', tag: 'Vendas' },
      { id: 'n3', title: 'Landing Page Otimizada', desc: 'Calculadora de ROI e vídeo demonstrativo', x: 780, y: 250, color: 'emerald', tag: 'Conversão' },
      { id: 'n4', title: 'Trial Guiado de 14 Dias', desc: 'Onboarding com suporte via WhatsApp', x: 1120, y: 160, color: 'indigo', tag: 'Retenção' },
      { id: 'n5', title: 'Fechamento Anual', desc: 'Assinatura digital e pagamento parcelado', x: 1120, y: 340, color: 'rose', tag: 'Receita' }
    ],
    edges: [
      { id: 'e1', from: 'root', to: 'n1', sourcePort: 'top', targetPort: 'left' },
      { id: 'e2', from: 'root', to: 'n2', sourcePort: 'bottom', targetPort: 'left' },
      { id: 'e3', from: 'n1', to: 'n3', sourcePort: 'right', targetPort: 'top', label: 'Cliques', labelMode: 'follow' },
      { id: 'e4', from: 'n2', to: 'n3', sourcePort: 'right', targetPort: 'bottom', label: 'Agendamentos', labelMode: 'follow' },
      { id: 'e5', from: 'n3', to: 'n4', sourcePort: 'right', targetPort: 'left', label: 'Sign-ups', labelMode: 'follow' },
      { id: 'e6', from: 'n4', to: 'n5', sourcePort: 'bottom', targetPort: 'top', label: 'SQLs', labelMode: 'follow' },
    ]
  }
};

const getPortCoordinates = (node, port) => {
  const w = NODE_WIDTH;
  const h = NODE_HEIGHT;
  switch (port) {
    case 'top': return { x: node.x + w / 2, y: node.y };
    case 'right': return { x: node.x + w, y: node.y + h / 2 };
    case 'bottom': return { x: node.x + w / 2, y: node.y + h };
    case 'left': return { x: node.x, y: node.y + h / 2 };
    default: return { x: node.x + w, y: node.y + h / 2 };
  }
};

const getSmartPort = (fromNode, toNode) => {
  const dx = (toNode.x + NODE_WIDTH / 2) - (fromNode.x + NODE_WIDTH / 2);
  const dy = (toNode.y + NODE_HEIGHT / 2) - (fromNode.y + NODE_HEIGHT / 2);

  if (Math.abs(dx) > Math.abs(dy)) {
    return dx > 0
      ? { sourcePort: 'right', targetPort: 'left' }
      : { sourcePort: 'left', targetPort: 'right' };
  } else {
    return dy > 0
      ? { sourcePort: 'bottom', targetPort: 'top' }
      : { sourcePort: 'top', targetPort: 'bottom' };
  }
};

const computeCurvedPath = (startX, startY, startPort, endX, endY, endPort) => {
  const dist = Math.hypot(endX - startX, endY - startY);
  const curvature = Math.max(40, Math.min(dist * 0.45, 180));

  let cp1X = startX;
  let cp1Y = startY;
  switch (startPort) {
    case 'top': cp1Y -= curvature; break;
    case 'bottom': cp1Y += curvature; break;
    case 'left': cp1X -= curvature; break;
    case 'right': default: cp1X += curvature; break;
  }

  let cp2X = endX;
  let cp2Y = endY;
  switch (endPort) {
    case 'top': cp2Y -= curvature; break;
    case 'bottom': cp2Y += curvature; break;
    case 'left': cp2X -= curvature; break;
    case 'right': default: cp2X += curvature; break;
  }

  const mt = 0.5;
  const mt3 = 0.125;
  const t3 = 0.125;
  const p1 = 0.375;

  const midX = mt3 * startX + p1 * cp1X + p1 * cp2X + t3 * endX;
  const midY = mt3 * startY + p1 * cp1Y + p1 * cp2Y + t3 * endY;

  const dX = 3 * mt * mt * (cp1X - startX) + 6 * mt * 0.5 * (cp2X - cp1X) + 3 * 0.25 * (endX - cp2X);
  const dY = 3 * mt * mt * (cp1Y - startY) + 6 * mt * 0.5 * (cp2Y - cp1Y) + 3 * 0.25 * (endY - cp2Y);

  let angleDeg = (Math.atan2(dY, dX) * 180) / Math.PI;
  if (angleDeg > 90) angleDeg -= 180;
  if (angleDeg < -90) angleDeg += 180;

  return {
    pathD: `M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`,
    midX,
    midY,
    angleDeg
  };
};

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [viewMode, setViewMode] = useState('completo');
  const [defaultLabelMode, setDefaultLabelMode] = useState('follow');

  // Pan & Zoom
  const [pan, setPan] = useState({ x: 40, y: 90 });
  const [zoom, setZoom] = useState(0.85);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  // Map Data
  const [nodes, setNodes] = useState(PRESET_TEMPLATES.saas_split.nodes);
  const [edges, setEdges] = useState(PRESET_TEMPLATES.saas_split.edges);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState(null);
  const [editingNodeId, setEditingNodeId] = useState(null);

  // Dragging State
  const [draggedNodeId, setDraggedNodeId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Touch Gesture Intent Tracker
  const touchTrackingRef = useRef({
    startX: 0,
    startY: 0,
    hasMovedPastThreshold: false,
    targetNodeId: null,
    isPortTouch: false
  });

  // Connecting line from port
  const [connectingState, setConnectingState] = useState(null);

  // Pinch-to-zoom focal point ref
  const pinchRef = useRef({
    initialDist: null,
    initialZoom: 0.85,
    initialPan: { x: 0, y: 0 },
    focalPoint: { x: 0, y: 0 }
  });
  const isTouchPanningRef = useRef(false);

  // Responsive UI & Menus
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isViewModeDropdownOpen, setIsViewModeDropdownOpen] = useState(false);
  const [isLabelModeDropdownOpen, setIsLabelModeDropdownOpen] = useState(false);
  const [isTemplatesDropdownOpen, setIsTemplatesDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Auto-save feedback
  const [lastSavedTime, setLastSavedTime] = useState('Salvo localmente');

  // PWA & Installation states
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isAppInstalled, setIsAppInstalled] = useState(false);
  const [showPwaInstallModal, setShowPwaInstallModal] = useState(false);
  const [isIos, setIsIos] = useState(false);

  // AI Modal
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');

  const canvasRef = useRef(null);

  useEffect(() => {
    document.title = "MeMap Studio";

    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(isIosDevice);

    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
      setIsAppInstalled(true);
    }

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsAppInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    try {
      const pwaManifest = {
        name: "MeMap Studio",
        short_name: "MeMap",
        description: "Crie mapas mentais, diagramas e fluxos inteligentes com IA e offline.",
        start_url: "/",
        display: "standalone",
        background_color: "#0f172a",
        theme_color: "#6366f1",
        orientation: "any",
        icons: [
          {
            src: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='25' fill='%236366f1'/><circle cx='50' cy='50' r='24' fill='%23ffffff'/><circle cx='50' cy='50' r='12' fill='%234338ca'/></svg>",
            sizes: "192x192 512x512",
            type: "image/svg+xml",
            purpose: "any maskable"
          }
        ]
      };

      const manifestBlob = new Blob([JSON.stringify(pwaManifest)], { type: 'application/json' });
      const manifestURL = URL.createObjectURL(manifestBlob);
      let manifestLink = document.querySelector('link[rel="manifest"]');
      if (!manifestLink) {
        manifestLink = document.createElement('link');
        manifestLink.rel = 'manifest';
        document.head.appendChild(manifestLink);
      }
      manifestLink.href = manifestURL;

      let metaAppleCapable = document.querySelector('meta[name="apple-mobile-web-app-capable"]');
      if (!metaAppleCapable) {
        metaAppleCapable = document.createElement('meta');
        metaAppleCapable.name = 'apple-mobile-web-app-capable';
        metaAppleCapable.content = 'yes';
        document.head.appendChild(metaAppleCapable);
      }

      let metaAppleTitle = document.querySelector('meta[name="apple-mobile-web-app-title"]');
      if (!metaAppleTitle) {
        metaAppleTitle = document.createElement('meta');
        metaAppleTitle.name = 'apple-mobile-web-app-title';
        metaAppleTitle.content = 'MeMap Studio';
        document.head.appendChild(metaAppleTitle);
      }

      let metaAppleStatus = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
      if (!metaAppleStatus) {
        metaAppleStatus = document.createElement('meta');
        metaAppleStatus.name = 'apple-mobile-web-app-status-bar-style';
        metaAppleStatus.content = 'black-translucent';
        document.head.appendChild(metaAppleStatus);
      }

      if ('serviceWorker' in navigator) {
        const swCode = `
          const CACHE_NAME = 'memap-pwa-v1';
          self.addEventListener('install', (event) => {
            self.skipWaiting();
          });
          self.addEventListener('activate', (event) => {
            event.waitUntil(self.clients.claim());
          });
          self.addEventListener('fetch', (event) => {
            event.respondWith(
              fetch(event.request).catch(() => caches.match(event.request))
            );
          });
        `;
        const swBlob = new Blob([swCode], { type: 'application/javascript' });
        const swUrl = URL.createObjectURL(swBlob);
        navigator.serviceWorker.register(swUrl).catch(() => {});
      }
    } catch (e) {
      console.debug('PWA initialization note:', e);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  useEffect(() => {
    try {
      const saved = window.sessionStorage?.getItem('memap_studio_saved_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.nodes && parsed.edges) {
          setNodes(parsed.nodes);
          setEdges(parsed.edges);
          if (parsed.viewMode) setViewMode(parsed.viewMode);
          if (parsed.defaultLabelMode) setDefaultLabelMode(parsed.defaultLabelMode);
        }
      }
    } catch (err) {
      console.debug('Storage load skipped', err);
    }
  }, []);

  const saveToLocalStorage = useCallback(() => {
    try {
      const payload = JSON.stringify({ nodes, edges, viewMode, defaultLabelMode });
      window.sessionStorage?.setItem('memap_studio_saved_v1', payload);
      const now = new Date();
      setLastSavedTime(`Salvo às ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
    } catch (e) {}
  }, [nodes, edges, viewMode, defaultLabelMode]);

  useEffect(() => {
    const timer = setTimeout(() => {
      saveToLocalStorage();
    }, 1200);
    return () => clearTimeout(timer);
  }, [nodes, edges, viewMode, defaultLabelMode, saveToLocalStorage]);

  const handleTriggerInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsAppInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      setShowPwaInstallModal(true);
    }
  };

  const clientToCanvasCoords = useCallback((clientX, clientY) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: (clientX - rect.left - pan.x) / zoom,
      y: (clientY - rect.top - pan.y) / zoom
    };
  }, [pan, zoom]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedNodeId) {
          deleteNode(selectedNodeId);
        } else if (selectedEdgeId) {
          setEdges(prev => prev.filter(edge => edge.id !== selectedEdgeId));
          setSelectedEdgeId(null);
        }
      } else if (e.key === 'Escape') {
        setSelectedNodeId(null);
        setSelectedEdgeId(null);
        setEditingNodeId(null);
        setConnectingState(null);
        setIsMobileMenuOpen(false);
        setIsViewModeDropdownOpen(false);
        setIsLabelModeDropdownOpen(false);
        setIsTemplatesDropdownOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNodeId, selectedEdgeId]);

  const handleWheel = (e) => {
    e.preventDefault();
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const zoomFactor = 1.08;
    const newZoom = e.deltaY < 0 ? zoom * zoomFactor : zoom / zoomFactor;
    const clampedZoom = Math.min(Math.max(newZoom, 0.2), 3);

    setPan({
      x: mouseX - ((mouseX - pan.x) / zoom) * clampedZoom,
      y: mouseY - ((mouseY - pan.y) / zoom) * clampedZoom
    });
    setZoom(clampedZoom);
  };

  const handleMouseDownCanvas = (e) => {
    if (
      e.target === canvasRef.current ||
      e.target.tagName === 'svg' ||
      e.target.classList.contains('canvas-background')
    ) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      setSelectedNodeId(null);
      setSelectedEdgeId(null);
      setConnectingState(null);
      setIsViewModeDropdownOpen(false);
      setIsLabelModeDropdownOpen(false);
      setIsTemplatesDropdownOpen(false);
    }
  };

  const handleMouseMove = (e) => {
    if (isPanning) {
      setPan({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y
      });
    } else if (draggedNodeId) {
      const coords = clientToCanvasCoords(e.clientX, e.clientY);
      setNodes(prev => prev.map(node => {
        if (node.id === draggedNodeId) {
          return {
            ...node,
            x: Math.round(coords.x - dragOffset.x),
            y: Math.round(coords.y - dragOffset.y)
          };
        }
        return node;
      }));
    } else if (connectingState) {
      const coords = clientToCanvasCoords(e.clientX, e.clientY);
      setConnectingState(prev => ({
        ...prev,
        currentX: coords.x,
        currentY: coords.y
      }));
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    setDraggedNodeId(null);
    if (connectingState) setConnectingState(null);
  };

  const handleTouchStartCanvas = (e) => {
    setIsViewModeDropdownOpen(false);
    setIsLabelModeDropdownOpen(false);
    setIsTemplatesDropdownOpen(false);

    if (e.touches.length === 2 && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const t1 = e.touches[0];
      const t2 = e.touches[1];

      const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      const focalScreenX = (t1.clientX + t2.clientX) / 2 - rect.left;
      const focalScreenY = (t1.clientY + t2.clientY) / 2 - rect.top;

      pinchRef.current = {
        initialDist: dist,
        initialZoom: zoom,
        initialPan: { ...pan },
        focalPoint: { x: focalScreenX, y: focalScreenY }
      };

      isTouchPanningRef.current = false;
      setDraggedNodeId(null);
      if (connectingState) setConnectingState(null);
    } else if (e.touches.length === 1) {
      const touch = e.touches[0];
      if (
        e.target === canvasRef.current ||
        e.target.tagName === 'svg' ||
        e.target.classList.contains('canvas-background')
      ) {
        isTouchPanningRef.current = true;
        setPanStart({ x: touch.clientX - pan.x, y: touch.clientY - pan.y });
        setSelectedNodeId(null);
        setSelectedEdgeId(null);
        setConnectingState(null);
      }
    }
  };

  const handleTouchMoveCanvas = (e) => {
    if (e.touches.length === 2 && pinchRef.current.initialDist !== null) {
      e.preventDefault();
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const currentDist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);

      const { initialDist, initialZoom, initialPan, focalPoint } = pinchRef.current;
      const scale = currentDist / initialDist;
      const targetZoom = Math.min(Math.max(initialZoom * scale, 0.25), 3);

      const newPanX = focalPoint.x - ((focalPoint.x - initialPan.x) / initialZoom) * targetZoom;
      const newPanY = focalPoint.y - ((focalPoint.y - initialPan.y) / initialZoom) * targetZoom;

      setZoom(targetZoom);
      setPan({ x: newPanX, y: newPanY });
    } else if (e.touches.length === 1) {
      const touch = e.touches[0];

      if (isTouchPanningRef.current) {
        setPan({
          x: touch.clientX - panStart.x,
          y: touch.clientY - panStart.y
        });
        return;
      }

      const tracker = touchTrackingRef.current;
      if (tracker.targetNodeId && !connectingState) {
        const deltaX = Math.abs(touch.clientX - tracker.startX);
        const deltaY = Math.abs(touch.clientY - tracker.startY);

        if (deltaX > 6 || deltaY > 6) {
          tracker.hasMovedPastThreshold = true;
        }

        if (tracker.hasMovedPastThreshold) {
          const coords = clientToCanvasCoords(touch.clientX, touch.clientY);
          setNodes(prev => prev.map(node => {
            if (node.id === tracker.targetNodeId) {
              return {
                ...node,
                x: Math.round(coords.x - dragOffset.x),
                y: Math.round(coords.y - dragOffset.y)
              };
            }
            return node;
          }));
        }
      } else if (connectingState) {
        const coords = clientToCanvasCoords(touch.clientX, touch.clientY);
        setConnectingState(prev => ({
          ...prev,
          currentX: coords.x,
          currentY: coords.y
        }));
      }
    }
  };

  const handleTouchEndCanvas = (e) => {
    if (e.touches.length < 2) {
      pinchRef.current.initialDist = null;
    }
    isTouchPanningRef.current = false;
    setDraggedNodeId(null);

    if (connectingState && e.changedTouches && e.changedTouches.length > 0) {
      const touch = e.changedTouches[0];
      const targetElement = document.elementFromPoint(touch.clientX, touch.clientY);
      const anchorPort = targetElement?.closest('[data-anchor-port]');
      if (anchorPort) {
        const targetNodeId = anchorPort.getAttribute('data-node-id');
        const targetPort = anchorPort.getAttribute('data-anchor-port');
        if (targetNodeId && targetPort && targetNodeId !== connectingState.fromNodeId) {
          createOrUpdateEdge(connectingState.fromNodeId, connectingState.fromPort, targetNodeId, targetPort);
        }
      }
      setConnectingState(null);
    }

    const tracker = touchTrackingRef.current;
    if (tracker.targetNodeId && !tracker.hasMovedPastThreshold && !tracker.isPortTouch) {
      setSelectedNodeId(tracker.targetNodeId);
      setSelectedEdgeId(null);
    }

    touchTrackingRef.current = {
      startX: 0,
      startY: 0,
      hasMovedPastThreshold: false,
      targetNodeId: null,
      isPortTouch: false
    };
  };

  const handleNodeMouseDown = (e, id) => {
    if (e.target.closest('button') || e.target.closest('[data-anchor-port]')) return;

    e.stopPropagation();
    setSelectedNodeId(id);
    setSelectedEdgeId(null);

    const node = nodes.find(n => n.id === id);
    if (!node) return;

    const coords = clientToCanvasCoords(e.clientX, e.clientY);
    setDragOffset({
      x: coords.x - node.x,
      y: coords.y - node.y
    });
    setDraggedNodeId(id);
  };

  const handleNodeTouchStart = (e, id) => {
    if (e.target.closest('button') || e.target.closest('[data-anchor-port]')) return;

    e.stopPropagation();
    const touch = e.touches[0];
    const node = nodes.find(n => n.id === id);
    if (!node) return;

    const coords = clientToCanvasCoords(touch.clientX, touch.clientY);
    setDragOffset({
      x: coords.x - node.x,
      y: coords.y - node.y
    });

    setDraggedNodeId(id);

    touchTrackingRef.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      hasMovedPastThreshold: false,
      targetNodeId: id,
      isPortTouch: false
    };
  };

  const startAnchorDrag = (e, nodeId, port) => {
    e.stopPropagation();
    touchTrackingRef.current.isPortTouch = true;
    const sourceNode = nodes.find(n => n.id === nodeId);
    if (!sourceNode) return;

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const cursorCanvas = clientToCanvasCoords(clientX, clientY);

    setConnectingState({
      fromNodeId: nodeId,
      fromPort: port,
      currentX: cursorCanvas.x,
      currentY: cursorCanvas.y
    });
  };

  const createOrUpdateEdge = (fromId, fromPort, toId, toPort) => {
    const existingIndex = edges.findIndex(
      edge => edge.from === fromId && edge.to === toId
    );

    if (existingIndex >= 0) {
      setEdges(prev => prev.map((edge, idx) => {
        if (idx === existingIndex) {
          return { ...edge, sourcePort: fromPort, targetPort: toPort };
        }
        return edge;
      }));
      setSelectedEdgeId(edges[existingIndex].id);
    } else {
      const newEdge = {
        id: 'e_' + Date.now(),
        from: fromId,
        to: toId,
        sourcePort: fromPort,
        targetPort: toPort,
        label: '',
        labelMode: defaultLabelMode
      };
      setEdges(prev => [...prev, newEdge]);
      setSelectedEdgeId(newEdge.id);
    }
  };

  const endAnchorDragOnPort = (e, targetNodeId, targetPort) => {
    e.stopPropagation();
    if (!connectingState) return;
    if (connectingState.fromNodeId === targetNodeId) {
      setConnectingState(null);
      return;
    }

    createOrUpdateEdge(connectingState.fromNodeId, connectingState.fromPort, targetNodeId, targetPort);
    setConnectingState(null);
  };

  const addNode = (parentId = null, preferredPort = 'right') => {
    const parent = parentId ? nodes.find(n => n.id === parentId) : null;
    const newId = 'n_' + Date.now();

    let newX = (-pan.x + 380) / zoom;
    let newY = (-pan.y + 240) / zoom;
    let srcPort = preferredPort;
    let tgtPort = 'left';

    if (parent) {
      switch (preferredPort) {
        case 'right':
          newX = parent.x + 300;
          newY = parent.y + (Math.random() * 50 - 25);
          tgtPort = 'left';
          break;
        case 'bottom':
          newX = parent.x + (Math.random() * 50 - 25);
          newY = parent.y + 190;
          tgtPort = 'top';
          break;
        case 'left':
          newX = parent.x - 300;
          newY = parent.y + (Math.random() * 50 - 25);
          tgtPort = 'right';
          break;
        case 'top':
          newX = parent.x + (Math.random() * 50 - 25);
          newY = parent.y - 190;
          tgtPort = 'bottom';
          break;
        default:
          newX = parent.x + 300;
          newY = parent.y;
          break;
      }
    }

    const newNode = {
      id: newId,
      title: 'Novo Conceito',
      desc: 'Detalhes ou instrução do fluxo',
      x: Math.round(newX),
      y: Math.round(newY),
      color: parent ? parent.color : 'indigo',
      tag: 'Item'
    };

    setNodes(prev => [...prev, newNode]);

    if (parent) {
      setEdges(prev => [...prev, {
        id: 'e_' + Date.now(),
        from: parent.id,
        to: newId,
        sourcePort: srcPort,
        targetPort: tgtPort,
        label: '',
        labelMode: defaultLabelMode
      }]);
    }

    setSelectedNodeId(newId);
    setSelectedEdgeId(null);
    setEditingNodeId(newId);
  };

  const deleteNode = (id) => {
    setNodes(prev => prev.filter(n => n.id !== id));
    setEdges(prev => prev.filter(e => e.from !== id && e.to !== id));
    if (selectedNodeId === id) setSelectedNodeId(null);
    if (editingNodeId === id) setEditingNodeId(null);
  };

  const updateNode = (id, fields) => {
    setNodes(prev => prev.map(n => n.id === id ? { ...n, ...fields } : n));
  };

  const updateEdge = (id, fields) => {
    setEdges(prev => prev.map(e => e.id === id ? { ...e, ...fields } : e));
  };

  const applyGlobalLabelMode = (mode) => {
    setDefaultLabelMode(mode);
    setEdges(prev => prev.map(edge => ({ ...edge, labelMode: mode })));
  };

  const applyAutoLayout = () => {
    if (nodes.length === 0) return;

    const adj = {};
    const inDegree = {};
    nodes.forEach(n => {
      adj[n.id] = [];
      inDegree[n.id] = 0;
    });

    edges.forEach(e => {
      if (adj[e.from]) adj[e.from].push(e.to);
      if (inDegree[e.to] !== undefined) inDegree[e.to]++;
    });

    let rootIds = nodes.filter(n => inDegree[n.id] === 0).map(n => n.id);
    if (rootIds.length === 0 && nodes.length > 0) rootIds = [nodes[0].id];

    const visited = new Set();
    const levels = {};

    const traverse = (nodeId, depth) => {
      visited.add(nodeId);
      if (!levels[depth]) levels[depth] = [];
      levels[depth].push(nodeId);

      const children = adj[nodeId] || [];
      children.forEach(childId => {
        if (!visited.has(childId)) {
          traverse(childId, depth + 1);
        }
      });
    };

    rootIds.forEach(r => traverse(r, 0));

    nodes.forEach(n => {
      if (!visited.has(n.id)) {
        if (!levels[0]) levels[0] = [];
        levels[0].push(n.id);
      }
    });

    const HORIZONTAL_SPACING = 340;
    const VERTICAL_SPACING = 160;

    const newPositions = {};
    Object.keys(levels).forEach(levelStr => {
      const depth = parseInt(levelStr);
      const levelNodes = levels[depth];
      const startY = 220 - ((levelNodes.length - 1) * VERTICAL_SPACING) / 2;

      levelNodes.forEach((id, index) => {
        newPositions[id] = {
          x: 80 + depth * HORIZONTAL_SPACING,
          y: startY + index * VERTICAL_SPACING
        };
      });
    });

    setNodes(prev => prev.map(node => {
      if (newPositions[node.id]) {
        return {
          ...node,
          x: newPositions[node.id].x,
          y: newPositions[node.id].y
        };
      }
      return node;
    }));

    setPan({ x: 40, y: 90 });
    setZoom(0.85);
  };

  const generateAiMindMap = async () => {
    if (!aiPrompt.trim()) return;
    setIsAiLoading(true);
    setAiError('');

    const apiKey = "";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;

    const systemPrompt = `Você é um arquiteto especialista em fluxos de negócios, arquitetura de sistemas e mapas conceituais.
Gere um diagrama rico, detalhado e organizado.
Para cada aresta (edge), escolha intencionalmente 'sourcePort' ('top'|'right'|'bottom'|'left') e 'targetPort' ('top'|'right'|'bottom'|'left') conforme a direção do raciocínio visual.
Responda ESTRITAMENTE em formato JSON com 'title', 'nodes' e 'edges'.
Língua: Português.`;

    const payload = {
      contents: [{
        parts: [{ text: `Crie um fluxo/mapa mental completo e detalhado sobre: "${aiPrompt}". Distribua os nós logicamente.` }]
      }],
      systemInstruction: { parts: [{ text: systemPrompt }] },
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            "title": { "type": "STRING" },
            "nodes": {
              "type": "ARRAY",
              "items": {
                "type": "OBJECT",
                "properties": {
                  "id": { "type": "STRING" },
                  "title": { "type": "STRING" },
                  "desc": { "type": "STRING" },
                  "color": { "type": "STRING" },
                  "tag": { "type": "STRING" },
                  "x": { "type": "NUMBER" },
                  "y": { "type": "NUMBER" }
                },
                "required": ["id", "title", "desc", "color", "tag", "x", "y"]
              }
            },
            "edges": {
              "type": "ARRAY",
              "items": {
                "type": "OBJECT",
                "properties": {
                  "id": { "type": "STRING" },
                  "from": { "type": "STRING" },
                  "to": { "type": "STRING" },
                  "sourcePort": { "type": "STRING" },
                  "targetPort": { "type": "STRING" },
                  "label": { "type": "STRING" }
                },
                "required": ["id", "from", "to"]
              }
            }
          },
          "required": ["nodes", "edges"]
        }
      }
    };

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Erro na API Gemini: ${response.statusText}`);
      }

      const result = await response.json();
      const rawText = result.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!rawText) throw new Error("Retorno vazio do modelo.");

      const parsed = JSON.parse(rawText);
      if (parsed.nodes && parsed.nodes.length > 0) {
        setNodes(parsed.nodes);
        setEdges((parsed.edges || []).map(e => ({ ...e, labelMode: defaultLabelMode })));
        setIsAiModalOpen(false);
        setAiPrompt('');
        applyAutoLayout();
      } else {
        throw new Error("Estrutura retornada sem nós suficientes.");
      }
    } catch (err) {
      console.error(err);
      setAiError(err.message || 'Falha ao gerar mapa mental. Tente novamente.');
    } finally {
      setIsAiLoading(false);
    }
  };

  const exportToJson = () => {
    const data = JSON.stringify({ nodes, edges, viewMode, defaultLabelMode }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `memap-studio-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const loadTemplate = (key) => {
    const tmpl = PRESET_TEMPLATES[key];
    if (tmpl) {
      setNodes(tmpl.nodes);
      setEdges(tmpl.edges);
      setSelectedNodeId(null);
      setSelectedEdgeId(null);
      setPan({ x: 40, y: 90 });
      setZoom(0.85);
      setIsMobileMenuOpen(false);
      setIsTemplatesDropdownOpen(false);
    }
  };

  const renderEdge = (edge) => {
    const fromNode = nodes.find(n => n.id === edge.from);
    const toNode = nodes.find(n => n.id === edge.to);
    if (!fromNode || !toNode) return null;

    let sPort = edge.sourcePort;
    let tPort = edge.targetPort;

    if (!sPort || !tPort || sPort === 'auto' || tPort === 'auto') {
      const smart = getSmartPort(fromNode, toNode);
      if (!sPort || sPort === 'auto') sPort = smart.sourcePort;
      if (!tPort || tPort === 'auto') tPort = smart.targetPort;
    }

    const startPt = getPortCoordinates(fromNode, sPort);
    const endPt = getPortCoordinates(toNode, tPort);

    const { pathD, midX, midY, angleDeg } = computeCurvedPath(
      startPt.x,
      startPt.y,
      sPort,
      endPt.x,
      endPt.y,
      tPort
    );

    const isSelected = selectedEdgeId === edge.id;
    const mode = edge.labelMode || defaultLabelMode;
    const effectiveAngle = mode === 'horizontal' ? 0 : angleDeg;

    return (
      <g key={edge.id} className="cursor-pointer">
        <path
          d={pathD}
          fill="none"
          stroke="transparent"
          strokeWidth="32"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedEdgeId(edge.id);
            setSelectedNodeId(null);
          }}
        />

        <path
          d={pathD}
          fill="none"
          stroke={isSelected ? '#6366f1' : (isDarkMode ? '#64748b' : '#94a3b8')}
          strokeWidth={isSelected ? '3.5' : (viewMode === 'sem-bordas' ? '2.8' : '2.4')}
          strokeDasharray={isSelected ? '6,3' : 'none'}
          className="transition-colors hover:stroke-indigo-400"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedEdgeId(edge.id);
            setSelectedNodeId(null);
          }}
        />

        <circle
          cx={startPt.x}
          cy={startPt.y}
          r={isSelected ? 6 : 4}
          fill={isSelected ? '#6366f1' : (isDarkMode ? '#818cf8' : '#6366f1')}
        />

        <circle
          cx={endPt.x}
          cy={endPt.y}
          r={isSelected ? 6 : 4.5}
          fill={isSelected ? '#6366f1' : (isDarkMode ? '#e2e8f0' : '#475569')}
        />

        {edge.label && (
          <g
            transform={`translate(${midX}, ${midY}) rotate(${effectiveAngle})`}
            className="cursor-pointer pointer-events-auto"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedEdgeId(edge.id);
            }}
          >
            <rect
              x={-Math.max(34, (edge.label.length * 7.5 + 16) / 2)}
              y="-13"
              width={Math.max(68, edge.label.length * 7.5 + 16)}
              height="26"
              rx="13"
              fill={isDarkMode ? '#0f172a' : '#ffffff'}
              stroke={isSelected ? '#6366f1' : (isDarkMode ? '#475569' : '#cbd5e1')}
              strokeWidth={isSelected ? '2' : '1.2'}
              className="drop-shadow-sm transition-all"
            />
            <text
              textAnchor="middle"
              dominantBaseline="central"
              y="0"
              fontSize="11"
              fill={isSelected ? '#818cf8' : (isDarkMode ? '#f1f5f9' : '#334155')}
              fontWeight="600"
              className="select-none pointer-events-none font-sans"
            >
              {edge.label}
            </text>
          </g>
        )}
      </g>
    );
  };

  const selectedNode = nodes.find(n => n.id === selectedNodeId);
  const selectedEdge = edges.find(e => e.id === selectedEdgeId);
  const currentViewModeObj = VIEW_MODES.find(m => m.id === viewMode) || VIEW_MODES[0];

  return (
    <div className={`relative w-full h-screen overflow-hidden select-none font-sans touch-none ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'}`}>

      {/* Top Header */}
      <header className={`absolute top-0 left-0 right-0 z-30 min-h-[56px] py-1.5 px-2.5 sm:px-4 border-b flex flex-wrap items-center justify-between gap-2 backdrop-blur-md transition-colors ${isDarkMode ? 'bg-slate-900/90 border-slate-800 text-white' : 'bg-white/90 border-slate-200 text-slate-800'}`}>
        
        {/* Left: Brand / Logo */}
        <div className="flex items-center space-x-2 shrink-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 shrink-0">
            <Compass className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm sm:text-base tracking-tight leading-none">MeMap Studio</span>
              <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-mono font-bold leading-none">PWA</span>
            </div>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 hidden sm:inline leading-tight">
              {lastSavedTime}
            </span>
          </div>
        </div>

        {/* Center: Scrollable Desktop & Tablet Actions */}
        <div className="hidden md:flex items-center gap-1.5 overflow-x-auto py-0.5 no-scrollbar max-w-[65vw]">
          
          {/* Add Node Button */}
          <button
            onClick={() => addNode(selectedNodeId, 'right')}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition active:scale-95 shrink-0"
            title={selectedNodeId ? "Criar novo nó conectado" : "Criar nó solto"}
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="whitespace-nowrap">{selectedNodeId ? "Novo Filho" : "Criar Nó"}</span>
          </button>

          {/* AI Generator Button */}
          <button
            onClick={() => setIsAiModalOpen(true)}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:opacity-95 text-white text-xs font-semibold shadow-sm transition active:scale-95 shrink-0"
            title="Gerar fluxo instantâneo com Inteligência Artificial"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="whitespace-nowrap">Gerar com IA</span>
          </button>

          {/* Auto Layout Button */}
          <button
            onClick={applyAutoLayout}
            className={`flex items-center space-x-1 px-2 py-1.5 rounded-lg border text-xs font-semibold transition shrink-0 ${isDarkMode ? 'border-slate-800 bg-slate-800/80 hover:bg-slate-800' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'}`}
            title="Reorganizar árvore hierárquica automaticamente"
          >
            <Layout className="w-3.5 h-3.5 text-indigo-500" />
            <span className="whitespace-nowrap">Auto-Layout</span>
          </button>

          {/* View Mode Dropdown */}
          <div className="relative shrink-0">
            <button
              onClick={() => {
                setIsViewModeDropdownOpen(!isViewModeDropdownOpen);
                setIsLabelModeDropdownOpen(false);
                setIsTemplatesDropdownOpen(false);
              }}
              className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition ${
                isDarkMode ? 'bg-slate-800/80 border-slate-700 text-slate-200' : 'bg-white border-slate-300 text-slate-700'
              }`}
              title="Modo visual do mapa mental"
            >
              <currentViewModeObj.icon className="w-3.5 h-3.5 text-indigo-500" />
              <span className="whitespace-nowrap">Modo: {currentViewModeObj.label}</span>
            </button>

            {isViewModeDropdownOpen && (
              <div className={`absolute left-0 mt-1 w-52 rounded-xl border shadow-xl p-1.5 z-50 backdrop-blur-md ${
                isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
              }`}>
                {VIEW_MODES.map(mode => {
                  const Icon = mode.icon;
                  return (
                    <button
                      key={mode.id}
                      onClick={() => {
                        setViewMode(mode.id);
                        setIsViewModeDropdownOpen(false);
                      }}
                      className={`w-full flex items-start space-x-2 p-1.5 rounded-lg text-left transition ${
                        viewMode === mode.id
                          ? 'bg-indigo-600 text-white'
                          : isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                      <div>
                        <div className="text-xs font-bold">{mode.label}</div>
                        <div className={`text-[10px] ${viewMode === mode.id ? 'text-indigo-100' : 'text-slate-400'}`}>
                          {mode.desc}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Label Orientation Dropdown */}
          <div className="relative shrink-0">
            <button
              onClick={() => {
                setIsLabelModeDropdownOpen(!isLabelModeDropdownOpen);
                setIsViewModeDropdownOpen(false);
                setIsTemplatesDropdownOpen(false);
              }}
              className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition ${
                isDarkMode ? 'bg-slate-800/80 border-slate-700 text-slate-200' : 'bg-white border-slate-300 text-slate-700'
              }`}
              title="Orientação dos rótulos de conexões"
            >
              <Type className="w-3.5 h-3.5 text-indigo-500" />
              <span className="whitespace-nowrap">Rótulos: {defaultLabelMode === 'follow' ? 'Curva' : 'Horizontal'}</span>
            </button>

            {isLabelModeDropdownOpen && (
              <div className={`absolute left-0 mt-1 w-56 rounded-xl border shadow-xl p-1.5 z-50 backdrop-blur-md ${
                isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
              }`}>
                <button
                  onClick={() => {
                    applyGlobalLabelMode('follow');
                    setIsLabelModeDropdownOpen(false);
                  }}
                  className={`w-full flex items-start space-x-2 p-1.5 rounded-lg text-left transition ${
                    defaultLabelMode === 'follow'
                      ? 'bg-indigo-600 text-white'
                      : isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
                  }`}
                >
                  <RotateCw className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs font-bold">Acompanhar Linha</div>
                    <div className={`text-[10px] ${defaultLabelMode === 'follow' ? 'text-indigo-100' : 'text-slate-400'}`}>
                      Gira suavemente na curva
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    applyGlobalLabelMode('horizontal');
                    setIsLabelModeDropdownOpen(false);
                  }}
                  className={`w-full flex items-start space-x-2 p-1.5 rounded-lg text-left transition ${
                    defaultLabelMode === 'horizontal'
                      ? 'bg-indigo-600 text-white'
                      : isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
                  }`}
                >
                  <Minus className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs font-bold">Sempre Horizontal</div>
                    <div className={`text-[10px] ${defaultLabelMode === 'horizontal' ? 'text-indigo-100' : 'text-slate-400'}`}>
                      Permanece fixo em 0°
                    </div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Templates Dropdown */}
          <div className="relative shrink-0">
            <button
              onClick={() => {
                setIsTemplatesDropdownOpen(!isTemplatesDropdownOpen);
                setIsViewModeDropdownOpen(false);
                setIsLabelModeDropdownOpen(false);
              }}
              className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition ${
                isDarkMode ? 'bg-slate-800/80 border-slate-700 text-slate-200' : 'bg-white border-slate-300 text-slate-700'
              }`}
              title="Carregar templates de negócios e diagramas"
            >
              <FolderOpen className="w-3.5 h-3.5 text-indigo-500" />
              <span className="whitespace-nowrap">Templates</span>
            </button>

            {isTemplatesDropdownOpen && (
              <div className={`absolute left-0 mt-1 w-64 rounded-xl border shadow-xl p-2 z-50 backdrop-blur-md ${
                isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
              }`}>
                <button
                  onClick={() => loadTemplate('saas_split')}
                  className="w-full text-left p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  <div className="font-bold text-xs text-indigo-500">SaaS Split Asaas</div>
                  <div className="text-[10px] text-slate-400">Fluxo de motoristas, subconta e split</div>
                </button>
                <button
                  onClick={() => loadTemplate('marketing_plan')}
                  className="w-full text-left p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  <div className="font-bold text-xs text-violet-500">Lançamento SaaS B2B</div>
                  <div className="text-[10px] text-slate-400">Inbound, SDR, trial e fechamento</div>
                </button>
              </div>
            )}
          </div>

          {/* Quick Search */}
          <div className={`relative flex items-center rounded-lg border px-2 py-1 text-xs transition w-28 lg:w-36 shrink-0 ${isDarkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-100 border-slate-300'}`}>
            <Search className="w-3 h-3 text-slate-400 mr-1.5 shrink-0" />
            <input
              type="text"
              placeholder="Buscar..."
              className="bg-transparent outline-none w-full text-xs"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-slate-600">
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Right: Actions, PWA & Controls */}
        <div className="flex items-center space-x-1.5 shrink-0">
          
          {/* Quick Add Node for Mobile */}
          <button
            onClick={() => addNode(selectedNodeId, 'right')}
            className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-600 text-white shadow-sm"
            title="Criar Nó"
          >
            <Plus className="w-4 h-4" />
          </button>

          {/* Quick AI for Mobile */}
          <button
            onClick={() => setIsAiModalOpen(true)}
            className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-sm"
            title="Gerar com IA"
          >
            <Sparkles className="w-4 h-4" />
          </button>

          {/* Auto Layout for Mobile */}
          <button
            onClick={applyAutoLayout}
            className={`md:hidden flex items-center justify-center w-8 h-8 rounded-lg border ${isDarkMode ? 'border-slate-800 bg-slate-800/80' : 'border-slate-200 bg-slate-100'}`}
            title="Auto-Layout"
          >
            <Layout className="w-4 h-4 text-indigo-500" />
          </button>

          {/* Install PWA Button */}
          {!isAppInstalled && (
            <button
              onClick={handleTriggerInstall}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition active:scale-95"
              title="Instalar MeMap Studio no Celular ou PC"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Instalar</span>
            </button>
          )}

          {/* Export JSON (Desktop) */}
          <button
            onClick={exportToJson}
            className={`hidden sm:flex items-center space-x-1 px-2 py-1.5 rounded-lg border text-xs font-semibold transition ${isDarkMode ? 'border-slate-800 bg-slate-800/80 hover:bg-slate-800 text-slate-200' : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'}`}
            title="Exportar arquivo JSON"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Exportar</span>
          </button>

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`w-8 h-8 flex items-center justify-center rounded-lg border text-xs transition ${isDarkMode ? 'border-slate-800 bg-slate-800/80 hover:bg-slate-800 text-amber-400' : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600'}`}
            title={isDarkMode ? "Modo Claro" : "Modo Escuro"}
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Mobile Menu Drawer Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden w-8 h-8 flex items-center justify-center rounded-lg border transition ${isDarkMode ? 'border-slate-800 bg-slate-800 text-white' : 'border-slate-200 bg-slate-100 text-slate-700'}`}
            title="Abrir Menu Completo"
          >
            {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden flex justify-end">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className={`relative w-80 max-w-[85vw] h-full shadow-2xl p-5 overflow-y-auto flex flex-col justify-between border-l transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <span className="font-bold text-sm flex items-center gap-2">
                  <Compass className="w-4 h-4 text-indigo-500" />
                  MeMap Studio
                </span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Install PWA Option Mobile */}
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleTriggerInstall();
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-md"
              >
                <span className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4" />
                  {isAppInstalled ? "App Instalado com Sucesso" : "Instalar no Celular (PWA)"}
                </span>
                <DownloadCloud className="w-4 h-4" />
              </button>

              {/* Mobile View Mode Selection */}
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-2">Modo de Exibição do Mapa</label>
                <div className="grid grid-cols-2 gap-2">
                  {VIEW_MODES.map(mode => {
                    const Icon = mode.icon;
                    return (
                      <button
                        key={mode.id}
                        onClick={() => {
                          setViewMode(mode.id);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between ${
                          viewMode === mode.id
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow'
                            : isDarkMode ? 'border-slate-800 bg-slate-800/60 text-slate-200' : 'border-slate-200 bg-slate-50 text-slate-700'
                        }`}
                      >
                        <Icon className="w-4 h-4 mb-1" />
                        <span className="text-xs font-bold">{mode.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Mobile Label Mode Selection */}
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-2">Orientação dos Rótulos</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => applyGlobalLabelMode('follow')}
                    className={`p-2.5 rounded-xl border text-left transition ${
                      defaultLabelMode === 'follow'
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow'
                        : isDarkMode ? 'border-slate-800 bg-slate-800/60 text-slate-200' : 'border-slate-200 bg-slate-50 text-slate-700'
                    }`}
                  >
                    <RotateCw className="w-4 h-4 mb-1" />
                    <span className="text-xs font-bold block">Acompanhar</span>
                    <span className="text-[10px] opacity-75">Gira na curva</span>
                  </button>
                  <button
                    onClick={() => applyGlobalLabelMode('horizontal')}
                    className={`p-2.5 rounded-xl border text-left transition ${
                      defaultLabelMode === 'horizontal'
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow'
                        : isDarkMode ? 'border-slate-800 bg-slate-800/60 text-slate-200' : 'border-slate-200 bg-slate-50 text-slate-700'
                    }`}
                  >
                    <Minus className="w-4 h-4 mb-1" />
                    <span className="text-xs font-bold block">Horizontal</span>
                    <span className="text-[10px] opacity-75">0° sempre reto</span>
                  </button>
                </div>
              </div>

              {/* Templates */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 block">Templates Prontos</label>
                <button
                  onClick={() => loadTemplate('saas_split')}
                  className="w-full text-left p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 text-xs font-medium transition"
                >
                  <span className="font-bold block text-indigo-500">SaaS Split de Pagamentos</span>
                  <span className="text-[11px] text-slate-400">Fluxo com Asaas, Subcontas e Relatórios</span>
                </button>

                <button
                  onClick={() => loadTemplate('marketing_plan')}
                  className="w-full text-left p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 text-xs font-medium transition"
                >
                  <span className="font-bold block text-violet-500">Lançamento SaaS B2B</span>
                  <span className="text-[11px] text-slate-400">Inbound, Outbound SDR, Trial e Fechamento</span>
                </button>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
              <button
                onClick={() => {
                  exportToJson();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold"
              >
                <Download className="w-4 h-4" />
                <span>Exportar JSON</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Interactive Canvas */}
      <div
        ref={canvasRef}
        onWheel={handleWheel}
        onMouseDown={handleMouseDownCanvas}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStartCanvas}
        onTouchMove={handleTouchMoveCanvas}
        onTouchEnd={handleTouchEndCanvas}
        className={`w-full h-full cursor-grab active:cursor-grabbing canvas-background ${isPanning ? 'cursor-grabbing' : ''}`}
        style={{
          backgroundImage: isDarkMode
            ? 'radial-gradient(circle, #334155 1.2px, transparent 1.2px)'
            : 'radial-gradient(circle, #cbd5e1 1.2px, transparent 1.2px)',
          backgroundSize: `${32 * zoom}px ${32 * zoom}px`,
          backgroundPosition: `${pan.x}px ${pan.y}px`
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none origin-top-left transition-transform duration-75"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`
          }}
        >
          {/* SVG Connections & Dragging Line */}
          <svg className="w-[10000px] h-[10000px] absolute top-0 left-0 pointer-events-auto overflow-visible">
            {edges.map(renderEdge)}

            {connectingState && (() => {
              const srcNode = nodes.find(n => n.id === connectingState.fromNodeId);
              if (!srcNode) return null;
              const start = getPortCoordinates(srcNode, connectingState.fromPort);
              const { pathD } = computeCurvedPath(
                start.x,
                start.y,
                connectingState.fromPort,
                connectingState.currentX,
                connectingState.currentY,
                'left'
              );

              return (
                <g>
                  <path
                    d={pathD}
                    fill="none"
                    stroke="#8b5cf6"
                    strokeWidth="3.5"
                    strokeDasharray="6,4"
                    className="animate-pulse"
                  />
                  <circle
                    cx={connectingState.currentX}
                    cy={connectingState.currentY}
                    r="7"
                    fill="#ec4899"
                  />
                </g>
              );
            })()}
          </svg>

          {/* Interactive Mind Map Nodes */}
          {nodes.map(node => {
            const isSelected = selectedNodeId === node.id;
            const isEditing = editingNodeId === node.id;
            const isBeingDragged = draggedNodeId === node.id;
            const presetColor = COLOR_PRESETS.find(c => c.id === node.color) || COLOR_PRESETS[0];

            const isFrameless = viewMode === 'sem-bordas';
            const isSimplified = viewMode === 'simplificado';
            const hideTags = viewMode === 'sem-tag' || isSimplified;

            return (
              <div
                key={node.id}
                onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
                onTouchStart={(e) => handleNodeTouchStart(e, node.id)}
                className={`group absolute pointer-events-auto w-[230px] rounded-2xl p-3.5 transition-all cursor-pointer flex flex-col justify-between ${
                  isFrameless
                    ? 'border-0 shadow-none'
                    : 'border-2 shadow-lg'
                } ${
                  isSelected
                    ? 'ring-4 ring-indigo-500/40 shadow-2xl scale-[1.02]'
                    : isBeingDragged
                    ? 'scale-[1.04] shadow-2xl opacity-95 z-30'
                    : 'hover:shadow-md'
                }`}
                style={{
                  left: `${node.x}px`,
                  top: `${node.y}px`,
                  backgroundColor: isFrameless
                    ? (isDarkMode ? 'rgba(30, 41, 59, 0.45)' : 'rgba(255, 255, 255, 0.75)')
                    : (isDarkMode ? presetColor.darkBg : presetColor.bg),
                  borderColor: isFrameless ? 'transparent' : (isDarkMode ? presetColor.darkBorder : presetColor.border),
                  color: isDarkMode ? presetColor.darkText : presetColor.text,
                  touchAction: 'none',
                  backdropFilter: isFrameless ? 'blur(8px)' : 'none'
                }}
              >
                {/* 4 CARDINAL ANCHORS */}
                <div
                  data-anchor-port="top"
                  data-node-id={node.id}
                  onMouseDown={(e) => startAnchorDrag(e, node.id, 'top')}
                  onMouseUp={(e) => endAnchorDragOnPort(e, node.id, 'top')}
                  onTouchStart={(e) => startAnchorDrag(e, node.id, 'top')}
                  title="Saída/Entrada: TOPO"
                  className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 flex items-center justify-center cursor-crosshair z-20"
                >
                  <div className="w-5 h-5 rounded-full bg-white dark:bg-slate-900 border-2 border-indigo-500 shadow-md flex items-center justify-center transition-transform hover:scale-125 pointer-events-none">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full" />
                  </div>
                </div>

                <div
                  data-anchor-port="right"
                  data-node-id={node.id}
                  onMouseDown={(e) => startAnchorDrag(e, node.id, 'right')}
                  onMouseUp={(e) => endAnchorDragOnPort(e, node.id, 'right')}
                  onTouchStart={(e) => startAnchorDrag(e, node.id, 'right')}
                  title="Saída/Entrada: DIREITA"
                  className="absolute -right-5 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center cursor-crosshair z-20"
                >
                  <div className="w-5 h-5 rounded-full bg-white dark:bg-slate-900 border-2 border-indigo-500 shadow-md flex items-center justify-center transition-transform hover:scale-125 pointer-events-none">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full" />
                  </div>
                </div>

                <div
                  data-anchor-port="bottom"
                  data-node-id={node.id}
                  onMouseDown={(e) => startAnchorDrag(e, node.id, 'bottom')}
                  onMouseUp={(e) => endAnchorDragOnPort(e, node.id, 'bottom')}
                  onTouchStart={(e) => startAnchorDrag(e, node.id, 'bottom')}
                  title="Saída/Entrada: FUNDO"
                  className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-10 h-10 flex items-center justify-center cursor-crosshair z-20"
                >
                  <div className="w-5 h-5 rounded-full bg-white dark:bg-slate-900 border-2 border-indigo-500 shadow-md flex items-center justify-center transition-transform hover:scale-125 pointer-events-none">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full" />
                  </div>
                </div>

                <div
                  data-anchor-port="left"
                  data-node-id={node.id}
                  onMouseDown={(e) => startAnchorDrag(e, node.id, 'left')}
                  onMouseUp={(e) => endAnchorDragOnPort(e, node.id, 'left')}
                  onTouchStart={(e) => startAnchorDrag(e, node.id, 'left')}
                  title="Saída/Entrada: ESQUERDA"
                  className="absolute -left-5 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center cursor-crosshair z-20"
                >
                  <div className="w-5 h-5 rounded-full bg-white dark:bg-slate-900 border-2 border-indigo-500 shadow-md flex items-center justify-center transition-transform hover:scale-125 pointer-events-none">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full" />
                  </div>
                </div>

                {/* Card Header */}
                {!isSimplified && (
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    {!hideTags ? (
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                        isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white/70 border-slate-200'
                      }`}>
                        {node.tag || 'Nó'}
                      </span>
                    ) : (
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: presetColor.border }} />
                    )}

                    <div className="flex items-center space-x-1">
                      <button
                        onPointerDown={(e) => e.stopPropagation()}
                        onTouchStart={(e) => e.stopPropagation()}
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          addNode(node.id, 'right');
                        }}
                        className="p-1 rounded-md hover:bg-black/10 active:bg-black/20 transition min-w-[26px] min-h-[26px] flex items-center justify-center"
                        title="Criar filho à direita"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onPointerDown={(e) => e.stopPropagation()}
                        onTouchStart={(e) => e.stopPropagation()}
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          deleteNode(node.id);
                        }}
                        className="p-1 rounded-md hover:bg-rose-500 hover:text-white transition min-w-[26px] min-h-[26px] flex items-center justify-center"
                        title="Deletar nó"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Node Content / Inline Editor */}
                {isEditing ? (
                  <div className="space-y-2 mt-1" onClick={e => e.stopPropagation()}>
                    <input
                      type="text"
                      value={node.title}
                      autoFocus
                      onChange={(e) => updateNode(node.id, { title: e.target.value })}
                      className="w-full text-xs font-bold px-2 py-1 rounded bg-white/95 text-slate-800 outline-none border border-indigo-400"
                      placeholder="Título"
                    />
                    <textarea
                      rows={2}
                      value={node.desc || ''}
                      onChange={(e) => updateNode(node.id, { desc: e.target.value })}
                      className="w-full text-[11px] px-2 py-1 rounded bg-white/95 text-slate-800 outline-none border border-indigo-300 resize-none"
                      placeholder="Descrição resumida"
                    />
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex gap-1">
                        {COLOR_PRESETS.map(c => (
                          <button
                            key={c.id}
                            onClick={() => updateNode(node.id, { color: c.id })}
                            className="w-4 h-4 rounded-full border"
                            style={{ backgroundColor: c.border }}
                          />
                        ))}
                      </div>
                      <button
                        onClick={() => setEditingNodeId(null)}
                        className="p-1.5 bg-indigo-600 text-white rounded hover:bg-indigo-700 min-w-[32px] min-h-[32px] flex items-center justify-center"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onDoubleClick={() => setEditingNodeId(node.id)}
                    className={isSimplified ? "py-1" : ""}
                  >
                    {isSimplified ? (
                      <div>
                        <div className="text-xs font-semibold leading-relaxed break-words">
                          {node.desc || node.title}
                        </div>
                        <div className="text-[10px] opacity-60 mt-1 font-mono uppercase">
                          {node.title !== node.desc ? node.title : ''}
                        </div>
                      </div>
                    ) : (
                      <>
                        <h3 className="text-xs sm:text-sm font-bold leading-snug break-words">
                          {node.title}
                        </h3>
                        {node.desc && (
                          <p className="text-[11px] sm:text-xs opacity-85 mt-1 line-clamp-3 leading-relaxed">
                            {node.desc}
                          </p>
                        )}
                      </>
                    )}
                  </div>
                )}

                {/* Card Footer Bar */}
                <div className="mt-2 flex items-center justify-between text-[10px] opacity-70">
                  <span className="flex items-center gap-1 font-medium">
                    <Move className="w-2.5 h-2.5" /> 4 Portas
                  </span>
                  <button
                    onPointerDown={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      setEditingNodeId(node.id);
                    }}
                    className="p-1 hover:opacity-100"
                    title="Editar texto"
                  >
                    <Edit3 className="w-3 h-3 cursor-pointer" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Canvas Controls */}
      <div className={`absolute bottom-4 sm:bottom-6 left-4 sm:left-6 z-20 flex items-center space-x-1.5 p-1.5 rounded-2xl border shadow-xl backdrop-blur-md ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-slate-200'}`}>
        <button
          onClick={() => setZoom(prev => Math.min(prev * 1.15, 3))}
          className={`p-2 rounded-xl transition min-w-[36px] min-h-[36px] flex items-center justify-center ${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}
          title="Aumentar Zoom"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        <span className="text-xs font-mono px-1.5 text-slate-500">
          {Math.round(zoom * 100)}%
        </span>

        <button
          onClick={() => setZoom(prev => Math.max(prev / 1.15, 0.25))}
          className={`p-2 rounded-xl transition min-w-[36px] min-h-[36px] flex items-center justify-center ${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}
          title="Diminuir Zoom"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        <div className="h-4 w-[1px] bg-slate-300 dark:bg-slate-700" />

        <button
          onClick={() => {
            setPan({ x: 40, y: 90 });
            setZoom(0.85);
          }}
          className={`p-2 rounded-xl transition min-w-[36px] min-h-[36px] flex items-center justify-center ${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}
          title="Centralizar Visualização"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Edge Inspector Panel */}
      {selectedEdge && (
        <aside className={`fixed sm:absolute bottom-0 sm:bottom-auto sm:top-20 right-0 sm:right-6 z-40 w-full sm:w-84 rounded-t-3xl sm:rounded-2xl border-t sm:border shadow-2xl backdrop-blur-md p-5 transition-all max-h-[85vh] overflow-y-auto ${isDarkMode ? 'bg-slate-900/95 border-slate-800 text-white' : 'bg-white/95 border-slate-200 text-slate-900'}`}>
          <div className="sm:hidden w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto mb-3" />

          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center space-x-2">
              <Compass className="w-4 h-4 text-indigo-500" />
              <h4 className="font-bold text-xs uppercase tracking-wider">
                Origem & Rota da Linha
              </h4>
            </div>
            <button
              onClick={() => setSelectedEdgeId(null)}
              className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 min-w-[32px] min-h-[32px] flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4 mt-4 text-xs">
            <div>
              <label className="block text-slate-400 font-semibold mb-1.5">
                Ponto de Saída (Origem):
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { id: 'top', label: 'Cima' },
                  { id: 'right', label: 'Direita' },
                  { id: 'bottom', label: 'Baixo' },
                  { id: 'left', label: 'Esq.' }
                ].map(p => (
                  <button
                    key={p.id}
                    onClick={() => updateEdge(selectedEdge.id, { sourcePort: p.id })}
                    className={`py-2 px-1 rounded-lg text-center font-medium border transition min-h-[38px] ${
                      (selectedEdge.sourcePort || 'right') === p.id
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1.5">
                Ponto de Entrada (Destino):
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { id: 'top', label: 'Cima' },
                  { id: 'right', label: 'Direita' },
                  { id: 'bottom', label: 'Baixo' },
                  { id: 'left', label: 'Esq.' }
                ].map(p => (
                  <button
                    key={p.id}
                    onClick={() => updateEdge(selectedEdge.id, { targetPort: p.id })}
                    className={`py-2 px-1 rounded-lg text-center font-medium border transition min-h-[38px] ${
                      (selectedEdge.targetPort || 'left') === p.id
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1.5">
                Texto / Rótulo da Conexão:
              </label>
              <input
                type="text"
                value={selectedEdge.label || ''}
                onChange={(e) => updateEdge(selectedEdge.id, { label: e.target.value })}
                placeholder="Ex: Liquida, Rejeita, Split..."
                className={`w-full p-2.5 rounded-xl border outline-none font-medium text-xs ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-800'}`}
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1.5">
                Orientação do Rótulo:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => updateEdge(selectedEdge.id, { labelMode: 'follow' })}
                  className={`py-2 px-2 rounded-xl text-center font-medium border transition flex items-center justify-center space-x-1.5 min-h-[38px] ${
                    (selectedEdge.labelMode || defaultLabelMode) === 'follow'
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Acompanhar Linha</span>
                </button>

                <button
                  type="button"
                  onClick={() => updateEdge(selectedEdge.id, { labelMode: 'horizontal' })}
                  className={`py-2 px-2 rounded-xl text-center font-medium border transition flex items-center justify-center space-x-1.5 min-h-[38px] ${
                    (selectedEdge.labelMode || defaultLabelMode) === 'horizontal'
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <Minus className="w-3.5 h-3.5" />
                  <span>Manter Horizontal</span>
                </button>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex gap-2">
              <button
                onClick={() => setSelectedEdgeId(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-semibold"
              >
                Concluir
              </button>
              <button
                onClick={() => {
                  setEdges(prev => prev.filter(e => e.id !== selectedEdge.id));
                  setSelectedEdgeId(null);
                }}
                className="py-2.5 px-4 rounded-xl bg-rose-500/10 text-rose-600 hover:bg-rose-500 hover:text-white font-semibold transition"
              >
                Excluir
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* Node Properties Panel */}
      {selectedNode && !selectedEdge && (
        <aside className={`fixed sm:absolute bottom-0 sm:bottom-auto sm:top-20 right-0 sm:right-6 z-40 w-full sm:w-80 rounded-t-3xl sm:rounded-2xl border-t sm:border shadow-2xl backdrop-blur-md p-5 transition-all max-h-[80vh] overflow-y-auto ${isDarkMode ? 'bg-slate-900/95 border-slate-800 text-white' : 'bg-white/95 border-slate-200 text-slate-900'}`}>
          <div className="sm:hidden w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto mb-3" />

          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <h4 className="font-semibold text-xs uppercase tracking-wider text-slate-400">
              Propriedades do Nó
            </h4>
            <button
              onClick={() => setSelectedNodeId(null)}
              className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:opacity-80"
            >
              Fechar
            </button>
          </div>

          <div className="space-y-3 mt-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Título</label>
              <input
                type="text"
                value={selectedNode.title}
                onChange={(e) => updateNode(selectedNode.id, { title: e.target.value })}
                className={`w-full p-2.5 rounded-xl border outline-none font-semibold ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-800'}`}
              />
            </div>

            {viewMode !== 'sem-tag' && viewMode !== 'simplificado' && (
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Tag / Categoria</label>
                <input
                  type="text"
                  value={selectedNode.tag || ''}
                  onChange={(e) => updateNode(selectedNode.id, { tag: e.target.value })}
                  className={`w-full p-2.5 rounded-xl border outline-none ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-800'}`}
                />
              </div>
            )}

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Descrição / Detalhes</label>
              <textarea
                rows={3}
                value={selectedNode.desc || ''}
                onChange={(e) => updateNode(selectedNode.id, { desc: e.target.value })}
                className={`w-full p-2.5 rounded-xl border outline-none resize-none ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-800'}`}
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-2 font-medium">Cor de Destaque</label>
              <div className="grid grid-cols-6 gap-2">
                {COLOR_PRESETS.map(c => (
                  <button
                    key={c.id}
                    onClick={() => updateNode(selectedNode.id, { color: c.id })}
                    className={`h-8 rounded-xl border-2 transition-transform active:scale-95 ${selectedNode.color === c.id ? 'ring-2 ring-indigo-500 scale-105' : ''}`}
                    style={{ backgroundColor: c.border, borderColor: isDarkMode ? '#1e293b' : '#ffffff' }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
              <span className="block text-slate-400 font-medium mb-2">Adicionar Filho:</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => addNode(selectedNode.id, 'right')}
                  className="py-2.5 px-2 rounded-xl bg-indigo-600/10 text-indigo-600 hover:bg-indigo-600 hover:text-white font-semibold transition text-center min-h-[38px]"
                >
                  + À Direita
                </button>
                <button
                  onClick={() => addNode(selectedNode.id, 'bottom')}
                  className="py-2.5 px-2 rounded-xl bg-indigo-600/10 text-indigo-600 hover:bg-indigo-600 hover:text-white font-semibold transition text-center min-h-[38px]"
                >
                  + Abaixo
                </button>
              </div>
            </div>
          </div>
        </aside>
      )}

      {/* PWA Install Guide Modal */}
      {showPwaInstallModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className={`w-full max-w-md rounded-t-3xl sm:rounded-2xl border shadow-2xl overflow-hidden max-h-[90vh] flex flex-col ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
            <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Instalar MeMap Studio</h3>
                  <p className="text-[11px] text-slate-400">Como adicionar à tela do seu celular</p>
                </div>
              </div>
              <button
                onClick={() => setShowPwaInstallModal(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 min-w-[32px] min-h-[32px] flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 sm:p-5 space-y-4 overflow-y-auto text-xs leading-relaxed">
              {isIos ? (
                <div className="space-y-3">
                  <p className="font-semibold text-slate-700 dark:text-slate-300">
                    No seu iPhone ou iPad (Safari):
                  </p>
                  <ol className="list-decimal pl-5 space-y-2 text-slate-600 dark:text-slate-400">
                    <li>Toque no botão de <strong>Compartilhar</strong> (ícone do quadrado com a seta para cima na barra inferior do Safari).</li>
                    <li>Role para baixo até encontrar a opção <strong>"Adicionar à Tela de Início"</strong> (+).</li>
                    <li>Toque em <strong>Adicionar</strong> no canto superior direito.</li>
                    <li>Pronto! O MeMap Studio abrirá em tela cheia com performance nativa e offline.</li>
                  </ol>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="font-semibold text-slate-700 dark:text-slate-300">
                    No seu Android (Chrome) ou Computador:
                  </p>
                  <ol className="list-decimal pl-5 space-y-2 text-slate-600 dark:text-slate-400">
                    <li>Toque no menu de <strong>três pontinhos (⋮)</strong> no canto superior direito do navegador.</li>
                    <li>Selecione <strong>"Instalar aplicativo"</strong> ou <strong>"Adicionar à tela inicial"</strong>.</li>
                    <li>Confirme a instalação. O ícone do MeMap Studio ficará disponível na gaveta de aplicativos.</li>
                  </ol>
                </div>
              )}

              <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                <div>
                  <strong>Benefícios do modo PWA:</strong> Funciona em tela cheia (sem barra de URL do navegador), salva suas alterações localmente no aparelho e carrega instantaneamente.
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setShowPwaInstallModal(false)}
                className="px-5 py-2.5 text-xs font-semibold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition"
              >
                Entendi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Gemini AI Modal */}
      {isAiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className={`w-full max-w-lg rounded-t-3xl sm:rounded-2xl border shadow-2xl overflow-hidden max-h-[90vh] flex flex-col ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
            <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Gerador com Gemini AI</h3>
                  <p className="text-[11px] text-slate-400">Gera diagramas com conexões 360°</p>
                </div>
              </div>
              <button
                onClick={() => setIsAiModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 min-w-[32px] min-h-[32px] flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 sm:p-5 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-2">
                  Descreva o fluxo ou sistema desejado:
                </label>
                <textarea
                  rows={3}
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Ex: SaaS com Split de pagamento para transporte, webhook e relatórios..."
                  className={`w-full p-3 rounded-xl border text-xs outline-none focus:ring-2 focus:ring-indigo-500 transition resize-none ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
                />
              </div>

              <div>
                <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">Sugestões rápidas:</span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    "Split Pix Asaas para Empresa de Transporte",
                    "Funil de Vendas SaaS B2B",
                    "Pipeline de CI/CD e Microserviços",
                    "Onboarding de Motoristas e KYC"
                  ].map((sug, i) => (
                    <button
                      key={i}
                      onClick={() => setAiPrompt(sug)}
                      className={`text-[11px] px-2.5 py-1.5 rounded-full border transition ${
                        isDarkMode
                          ? 'border-slate-800 bg-slate-800/60 hover:bg-slate-800 text-slate-300'
                          : 'border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              </div>

              {aiError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs">
                  {aiError}
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end space-x-2 shrink-0">
              <button
                onClick={() => setIsAiModalOpen(false)}
                className="px-4 py-2.5 text-xs font-semibold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              >
                Cancelar
              </button>

              <button
                onClick={generateAiMindMap}
                disabled={isAiLoading || !aiPrompt.trim()}
                className="flex items-center space-x-2 px-4 py-2.5 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white transition active:scale-95 shadow-md shadow-indigo-600/20"
              >
                {isAiLoading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Gerando mapa...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Gerar Diagrama</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
