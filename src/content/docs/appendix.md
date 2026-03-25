---
title: "附录"
description: "完整配置参考手册、术语表、资源链接"
---

# 附录

---

## 附录 A 配置参考手册

### 完整配置结构

```json5
{
  // JSON Schema（可选，用于编辑器自动补全）
  $schema: "https://openclaw.dev/schema/config.json",

  // 配置拆分：agents: { $include: "./agents.json5" }（见第 4 章）

  // ── Gateway 配置 ──
  gateway: {
    port: 18789,                          // 监听端口
    bind: "loopback",                     // 绑定地址：loopback | lan | tailnet
    auth: {
      mode: "token",                      // 认证模式：token | password | trusted-proxy
    },
    reload: {
      mode: "hybrid",                     // 热更新：hybrid | hot | restart | off
      debounceMs: 300,                    // 防抖延迟
    },
  },

  // ── Agent 配置 ──
  agents: {
    defaults: {
      workspace: "~/.openclaw/workspace",
      model: {
        primary: "deepseek/deepseek-v3.2",
        fallbacks: ["minimax/MiniMax-M2.5"],
      },
      models: {
        "deepseek/deepseek-v3.2": { alias: "DeepSeek" },
        "minimax/MiniMax-M2.5": { alias: "MiniMax" },
      },
      imageMaxDimensionPx: 1200,
      heartbeat: {
        every: "30m",
        target: "last",
        lightContext: false,
        activeHours: {
          start: "09:00",
          end: "22:00",
          timezone: "Asia/Shanghai",
        },
      },
    },
    list: [
      { id: "main", default: true },
    ],
  },

  // ── Session 配置 ──
  session: {
    dmScope: "per-channel-peer",          // main | per-peer | per-channel-peer | per-account-channel-peer
    identityLinks: {
      alice: ["telegram:123", "discord:456"],
    },
  },

  // ── Channel 配置（对象格式，enabled: true 启用）──
  channels: {
    telegram: {
      enabled: true,
      botToken: "...",
      proxy: "socks5://127.0.0.1:1080",
    },
    discord: {
      enabled: true,
      token: "...",           // Discord 用 token（不是 botToken）
    },
    whatsapp: {
      enabled: true,
    },
    feishu: {
      enabled: true,
      accounts: {
        main: {
          appId: "cli_xxxxx",
          appSecret: "...",
        },
      },
    },
  },

  // ── Bindings 路由 ──
  bindings: [
    { agentId: "home", match: { channel: "whatsapp" } },
    { agentId: "review", match: { channel: "discord", peer: { kind: "channel", id: "CHANNEL_ID" } } },
  ],

  // ── 模型提供商 ──
  models: {
    providers: {
      deepseek: {
        api: "openai-completions",
        baseUrl: "https://api.deepseek.com/v1",
      },
      "dashscope-coding": {
        api: "openai-completions",
        baseUrl: "https://coding.dashscope.aliyuncs.com/v1",
      },
      ollama: {
        baseUrl: "http://localhost:11434",
        api: "ollama",
      },
    },
  },

  // ── 环境变量 ──
  env: {
    DEEPSEEK_API_KEY: "sk-xxxxx",
    shellEnv: { enabled: true, timeoutMs: 15000 },
  },

  // ── Cron 定时任务（全局设置，具体 job 通过 CLI 创建）──
  cron: {
    enabled: true,
    maxConcurrentRuns: 2,
    sessionRetention: "24h",
  },
  // 创建 cron job 示例：
  // openclaw cron add --name "晨报" --cron "0 8 * * *" \
  //   --message "生成今日简报" --announce --channel telegram

  // ── 工具配置 ──
  tools: {
    profile: "coding",        // minimal | coding | messaging | full
  },
  // Exec 审批通过独立的 ~/.openclaw/exec-approvals.json 管理
  // CLI: openclaw approvals allowlist add "/usr/bin/uptime"
}
```

---

## 附录 B CLI 命令速查表

### Gateway 管理

| 命令 | 说明 |
|------|------|
| `openclaw gateway` | 前台启动 Gateway |
| `openclaw gateway install` | 安装为系统服务 |
| `openclaw gateway start` | 启动 daemon |
| `openclaw gateway stop` | 停止 |
| `openclaw gateway restart` | 重启 |
| `openclaw gateway status` | 查看状态 |
| `openclaw logs` | 查看日志 |
| `openclaw logs --limit 100` | 查看最近 100 行日志 |

### 配置管理

| 命令 | 说明 |
|------|------|
| `openclaw config get <path>` | 读取配置值 |
| `openclaw config set <path> <value>` | 设置配置值 |
| `openclaw config unset <path>` | 删除配置项 |
| `openclaw configure` | 交互式配置向导 |

### Agent 管理

| 命令 | 说明 |
|------|------|
| `openclaw agents list` | 列出所有 Agent |
| `openclaw agents add <id> --workspace <path>` | 添加 Agent |
| `openclaw agents delete <id>` | 删除 Agent |
| `openclaw agents bindings` | 查看路由规则 |
| `openclaw agents bind --agent <id> --bind <rule>` | 添加路由绑定 |
| `openclaw agents unbind --agent <id> --bind <rule>` | 移除路由绑定 |
| `openclaw agents set-identity --agent <id> --name "Name"` | 设置 Agent 身份 |

### 模型管理

| 命令 | 说明 |
|------|------|
| `openclaw models list` | 列出可用模型 |
| `openclaw models status` | 查看模型状态 |
| `openclaw models set <provider/model>` | 设置当前模型 |
| `openclaw models aliases add <alias> <provider/model>` | 添加模型别名 |
| `openclaw models scan --min-params 5` | 扫描 OpenRouter 免费模型（≥50 亿参数） |

### 会话管理

| 命令 | 说明 |
|------|------|
| `openclaw sessions` | 列出会话 |
| `openclaw sessions --active 30` | 查看最近 30 分钟活跃的会话 |
| `openclaw sessions cleanup --dry-run` | 预览清理 |
| `openclaw sessions cleanup --enforce` | 执行清理 |

### 诊断与修复

| 命令 | 说明 |
|------|------|
| `openclaw doctor` | 全面诊断 |
| `openclaw doctor --fix` | 自动修复 |
| `openclaw status` | 总体状态 |
| `openclaw health` | 健康检查 |
| `openclaw security audit` | 安全审计 |
| `openclaw security audit --fix` | 安全修复 |

### 渠道管理

| 命令 | 说明 |
|------|------|
| `openclaw channels add --channel <type> --token <token>` | 添加渠道 |
| `openclaw channels login --channel <type>` | 渠道登录（如 WhatsApp 扫码） |

### Node 管理

| 命令 | 说明 |
|------|------|
| `openclaw qr` | 生成配对二维码 |
| `openclaw node run --host <gateway-host>` | 前台启动 Headless Node |
| `openclaw node install --host <gateway-host>` | 安装为系统服务 |
| `openclaw node status` | 查看状态 |
| `openclaw node stop` | 停止 |

### 技能管理

| 命令 | 说明 |
|------|------|
| `clawhub install <slug>` | 安装技能 |
| `clawhub publish <dir>` | 发布技能目录 |

### 其他

| 命令 | 说明 |
|------|------|
| `openclaw --version` | 查看版本 |
| `openclaw onboard --install-daemon` | 初始引导 |
| `openclaw dashboard` | 打开浏览器控制台 |
| `openclaw message send --target <id> --message <msg>` | 发送消息 |

---

## 附录 C FAQ 常见问题

**Q: OpenClaw 支持中文回复吗？**

A: 支持。回复语言由模型决定，在 SOUL.md 中设置"默认用中文回复"即可。

**Q: 可以同时接多少个渠道？**

A: 没有硬性限制。实际取决于服务器资源和网络带宽。

**Q: 换模型需要修改代码吗？**

A: 不需要。只需修改 `model.primary` 配置项，无需改动任何代码。

**Q: 数据存在哪里？**

A: 所有数据存储在 `~/.openclaw/` 目录下，完全本地，不经过任何第三方服务。

**Q: API Key 安全吗？**

A: 推荐通过环境变量而非配置文件设置 API Key。如果写在配置文件中，建议拆分到独立的 `env.json5` 并加入 `.gitignore`。

**Q: Gateway 挂了怎么办？**

A: 使用 systemd 或 `--restart unless-stopped`（Docker）实现自动重启。`openclaw doctor --fix` 可以修复常见问题。

**Q: 升级会丢数据吗？**

A: 不会。`npm install -g openclaw@latest` 只更新程序本体，`~/.openclaw/` 目录不受影响。建议升级前备份。

**Q: 微信怎么接入？还会被封号吗？**

A: 2026 年 3 月 22 日起，微信官方推出了「微信 ClawBot」插件，个人微信原生支持，不需要企业微信或第三方协议，不存在封号风险。要求微信 8.0.70+、OpenClaw 2026.3.22+，安装命令：`npx -y @tencent-weixin/openclaw-weixin-cli@latest install`，手机扫码即可连接。目前灰度放量中，详见第 7 章。

**Q: 飞书 Bot 不收消息？**

A: 检查三件事：1) 应用已发布并审批通过；2) 事件订阅包含 `im.message.receive_v1` 且使用**长连接模式**（WebSocket，不是 Webhook）；3) 配置事件订阅时 Gateway 必须在运行。

**Q: 云厂商 Coding Plan Key 用不了？**

A: Coding Plan 使用专用 Key（`sk-sp-` 开头）和专用 Base URL，不是普通 API Key。必须配置为 Custom Provider（`api: "openai-completions"`）。详见第 8 章。

**Q: Agent 回复很慢？**

A: 1) 国际模型延迟高，切换到国产模型直连；2) 上下文太大，用 `/status` 检查 token 用量，`/compact` 压缩；3) 模型服务器繁忙，等一会儿或切换 fallback。

**Q: 多人使用时会话内容串了？**

A: 必须设置 `session.dmScope: "per-channel-peer"`。默认值 `"main"` 会导致所有人共享同一个会话上下文。详见第 5 章。

---

## 附录 D 踩坑记录

### Token 计费隐藏坑

- **System Prompt 也计 token**：每次会话都会注入 Bootstrap 文件，这些都消耗 token。SOUL.md 写得太长会显著增加每次对话的成本。
- **图片消耗大量 token**：一张未压缩的 4K 截图可能消耗上万 token。务必设置 `imageMaxDimensionPx`。
- **Heartbeat 成本失控**：默认心跳加载完整上下文，token 消耗较大。每 10 分钟一次成本很高。务必开启 `lightContext: true`！

### 心跳成本失控

```json5
// 错误：每 10 分钟完整上下文心跳
{
  agents: { defaults: { heartbeat: { every: "10m" } } }
  // 每次心跳加载完整上下文，成本失控
}

// 正确：优化后
{
  agents: { defaults: { heartbeat: {
    every: "10m",
    lightContext: true,
    // 仅注入 HEARTBEAT.md，大幅降低成本
  } } }
}
```

### 消息格式差异

不同渠道的消息格式不同，Agent 的回复可能在某些渠道显示异常：

- Telegram 支持 Markdown 和 HTML
- Discord 支持有限的 Markdown
- WhatsApp 支持基本的粗体/斜体
- 飞书支持富文本卡片

Agent 通常能自适应，但如果遇到格式问题，可以在 AGENTS.md 中指定回复格式偏好。

### 国内网络专题

| 场景 | 解决方案 |
|------|---------|
| npm 安装慢 | `--registry=https://registry.npmmirror.com` |
| Telegram/Discord 连不上 | 渠道级 `proxy` 配置 |
| OpenAI/Anthropic API 不可达 | 使用 OpenRouter 或国产模型 |
| install.sh 下载超时 | `export https_proxy=http://127.0.0.1:7890` |
| shellEnv 读取超时 | 增大 `timeoutMs` 或简化 shell 启动脚本 |

---

## 附录 E 社区资源

| 资源 | 说明 | 地址 |
|------|------|------|
| ClawHub | 社区技能注册表，13,000+ 个技能 | clawhub.dev |
| awesome-openclaw-skills | 5,400+ 个精选技能 | github.com/VoltAgent/awesome-openclaw-skills |
| awesome-openclaw-usecases | 42 个真实用例 | github.com/hesamsheikh/awesome-openclaw-usecases |
| clawskills.sh | 技能浏览网站 | clawskills.sh |

### Coding Plan 对比表

> **注意**：以下信息截至 2026 年 3 月，请以各平台官网为准。

| 方案 | 首月/月费 | 支持模型 | 特点 |
|------|----------|---------|------|
| 阿里云百炼 | ¥7.9 | Qwen3.5+, GLM-4.7, Kimi K2.5, M2.5 | 模型最多 |
| 腾讯云 LKEAP | ¥7.9 | 混元 2.0, Kimi K2.5, GLM-4.7, M2.5 | 含自研混元 |
| 百度千帆 | ¥7.9 | GLM-4.7, M2.5, Kimi K2.5, 文心等 | 多模型聚合 |
| MiniMax | 按量 | M2.7 / M2.5 | 编码最强，$0.30/M 输入 |
| Kimi | 按量/订阅 | K2.5 | 长上下文 256K |
| GLM | 按量/订阅 | GLM-5 | 工程能力强 |
| DeepSeek | 按量 | V3.2, R1 | 性价比之王 |
| Qwen | 免费 | Qwen3.5 | 每天 2000 次 |
| MiMo | 免费 | V2-Flash | 262K context |
| Ollama | 免费 | 各种开源模型 | 完全离线 |
| OpenRouter | 按量 | 100+ 模型 | 一 Key 打天下 |

---

## 附录 F 术语表

| 术语 | 英文 | 说明 |
|------|------|------|
| 网关 | Gateway | OpenClaw 的核心进程，负责消息路由和管理 |
| 智能体 | Agent | AI 运行时，拥有独立工作区和记忆 |
| 渠道 | Channel | 连接聊天平台的适配层 |
| 节点 | Node | 运行在手机/电脑上的客户端 |
| 工作区 | Workspace | Agent 的工作目录，存放 Bootstrap 文件和记忆 |
| 技能 | Skill | 结构化提示词，安装到 Agent 扩展能力 |
| 心跳 | Heartbeat | Agent 定期主动唤醒机制 |
| 压缩 | Compaction | 上下文接近上限时自动整理并持久化 |
| 回退链 | Fallbacks | 主模型失败时按顺序尝试备选模型 |
| 路由规则 | Bindings | 决定消息路由到哪个 Agent |
| 会话作用域 | dmScope | 控制不同来源消息的会话隔离粒度 |
| 身份链接 | identityLinks | 跨平台用户识别 |
| 热更新 | Hot Reload | 修改配置后无需重启即可生效 |
| 配置拆分 | $include | 将大配置文件拆分成多个子文件 |
| 提供商 | Provider | 模型 API 服务商（如 DeepSeek、Anthropic） |
| ClawHub | ClawHub | OpenClaw 的公共技能注册表 |
| Bootstrap 文件 | Bootstrap Files | 每次会话注入的 Markdown 文件（SOUL.md 等） |
| 守护进程 | Daemon | 后台运行的长期服务 |
| Token | Token | 文本处理的最小单位，也指 API 认证令牌 |
