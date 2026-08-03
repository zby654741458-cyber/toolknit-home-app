import { getLang } from './i18n.js';
import { HELP_CONTENT_EN } from './help-data-en.js';

export const HELP_CONTENT = {
  'overview': {
    title: '功能概览',
    html: `<div class="help-doc">
      <h2>ToolKnit 功能概览</h2>
      <p>ToolKnit 是一款<strong>纯本地</strong>多功能工具箱桌面应用，涵盖 PDF、图像、音频、视频、文本、计算器、创意和 AI 八大工具分类，所有文件处理均在本地完成，不上传服务器。</p>

      <h3>工具分类一览</h3>
      <div class="help-tool-grid">
        <div class="help-tool-card"><div class="help-tool-card-name">PDF 工具</div><div class="help-tool-card-desc">合并、拆分、旋转、加密、解密、压缩、文字增强</div></div>
        <div class="help-tool-card"><div class="help-tool-card-name">图像工具</div><div class="help-tool-card-desc">格式转换、图片压缩、图标生成器</div></div>
        <div class="help-tool-card"><div class="help-tool-card-name">音频工具</div><div class="help-tool-card-desc">格式转换、BPM 测速、剪辑、裁剪、合并、提取</div></div>
        <div class="help-tool-card"><div class="help-tool-card-name">视频工具</div><div class="help-tool-card-desc">格式转换、压缩、裁剪、转 GIF、合并</div></div>
        <div class="help-tool-card"><div class="help-tool-card-name">文本工具</div><div class="help-tool-card-desc">文本对比、字符统计、格式化、编码转换</div></div>
        <div class="help-tool-card"><div class="help-tool-card-name">计算器工具</div><div class="help-tool-card-desc">科学计算、单位换算、汇率换算、贷款计算</div></div>
        <div class="help-tool-card"><div class="help-tool-card-name">创意工具</div><div class="help-tool-card-desc">配色提取、配色生成、密码生成器、打字测试</div></div>
        <div class="help-tool-card"><div class="help-tool-card-name">AI 工具</div><div class="help-tool-card-desc">AI 润色、AI 翻译、AI 文档、AI 对话</div></div>
      </div>

      <h3>核心特性</h3>
      <ul>
        <li><strong>纯本地处理</strong>：所有文件操作在设备本地完成，文件不上传任何服务器</li>
        <li><strong>批量操作</strong>：支持批量文件处理，提高工作效率</li>
        <li><strong>拖拽上传</strong>：支持拖拽文件到工具页面直接处理</li>
        <li><strong>双语界面</strong>：支持中文和英文切换</li>
        <li><strong>自动更新</strong>：支持在线检查并下载新版本</li>
        <li><strong>FFmpeg 扩展</strong>：音视频工具自动下载 FFmpeg 扩展包</li>
      </ul>

      <div class="help-note">
        <p>部分工具（如音频转换、视频转换）需要 FFmpeg 扩展包，首次使用时会提示下载，下载后即可离线使用。</p>
      </div>
    </div>`
  },
  'install': {
    title: '安装与启动',
    html: `<div class="help-doc">
      <h2>安装与启动</h2>

      <h3>系统要求</h3>
      <ul>
        <li>操作系统：Windows 10/11（64 位）</li>
        <li>内存：建议 4GB 以上</li>
        <li>磁盘空间：至少 200MB（含 FFmpeg 扩展包约 300MB）</li>
      </ul>

      <h3>安装步骤</h3>
      <ol class="help-steps">
        <li>下载 ToolKnit 安装包（<code>.exe</code> 安装程序）</li>
        <li>双击运行安装程序，选择安装路径</li>
        <li>等待安装完成，桌面会出现 ToolKnit 快捷方式</li>
        <li>双击快捷方式启动应用</li>
      </ol>

      <h3>首次启动</h3>
      <p>首次启动时，应用会自动检测系统环境。如果使用音视频相关工具，会提示下载 FFmpeg 扩展包，根据网络情况下载约 80-100MB。</p>

      <div class="help-note">
        <p>安装程序会根据系统语言自动选择下载源（中文用户使用国内源，英文用户使用海外源），确保下载速度最优。</p>
      </div>
    </div>`
  },
  'settings': {
    title: '设置与偏好',
    html: `<div class="help-doc">
      <h2>设置与偏好</h2>
      <p>点击左侧边栏底部的<strong>设置图标</strong>进入设置页面，可进行以下配置：</p>

      <h3>语言切换</h3>
      <p>支持<strong>中文</strong>和<strong>English</strong>两种语言，切换后界面立即生效。</p>

      <h3>版本与更新</h3>
      <p>显示当前版本号，点击"检查更新"可手动检测新版本。如果有新版本，会显示更新日志并提示下载。</p>

      <h3>默认存储位置</h3>
      <p>显示文件默认保存路径（通常为"文档"文件夹下的 ToolKnit 目录），点击"打开文件夹"可快速访问。</p>

      <h3>帮助与反馈</h3>
      <p>点击"帮助中心"打开本帮助页面；点击"反馈 BUG"可提交问题反馈。</p>
    </div>`
  },
  'update': {
    title: '版本更新',
    html: `<div class="help-doc">
      <h2>版本更新</h2>

      <h3>自动检查更新</h3>
      <p>ToolKnit 在启动时会自动检查新版本。如果发现新版本，会弹出更新提示窗口，显示新版本号和更新日志。</p>

      <h3>手动检查更新</h3>
      <ol class="help-steps">
        <li>点击侧边栏底部的<strong>设置图标</strong></li>
        <li>在"版本与更新"区域点击"检查更新"按钮</li>
        <li>如果有新版本，点击"立即更新"开始下载</li>
        <li>下载完成后应用会自动安装并重启</li>
      </ol>

      <h3>强制更新</h3>
      <p>某些关键版本会触发强制更新，用户必须更新到最新版本才能继续使用，确保应用安全性和稳定性。</p>

      <div class="help-note">
        <p>更新下载采用双源策略：中文用户优先从国内源下载，英文用户优先从海外源下载，确保下载速度。</p>
      </div>
    </div>`
  },
  'faq-general': {
    title: '通用问题',
    html: `<div class="help-doc">
      <h2>常见问题 - 通用</h2>

      <div class="help-faq-item">
        <div class="help-faq-q">Q：ToolKnit 是免费的吗？</div>
        <div class="help-faq-a">A：是的，ToolKnit 完全免费使用，不包含任何广告或内购。</div>
      </div>

      <div class="help-faq-item">
        <div class="help-faq-q">Q：文件会上传到服务器吗？</div>
        <div class="help-faq-a">A：不会。所有文件处理均在本地完成，文件不会上传到任何服务器。AI 工具仅将文本内容发送到 AI 接口进行处理。</div>
      </div>

      <div class="help-faq-item">
        <div class="help-faq-q">Q：支持哪些操作系统？</div>
        <div class="help-faq-a">A：目前支持 Windows 10/11（64 位），macOS 和 Linux 版本正在规划中。</div>
      </div>

      <div class="help-faq-item">
        <div class="help-faq-q">Q：如何切换语言？</div>
        <div class="help-faq-a">A：点击侧边栏底部的设置图标，在"语言"区域选择中文或 English 即可。</div>
      </div>

      <div class="help-faq-item">
        <div class="help-faq-q">Q：文件保存在哪里？</div>
        <div class="help-faq-a">A：默认保存在"文档"文件夹下的 ToolKnit 目录中。可在设置页面查看和打开存储位置。</div>
      </div>

      <div class="help-faq-item">
        <div class="help-faq-q">Q：支持批量处理吗？</div>
        <div class="help-faq-a">A：支持。大部分工具（PDF 合并、图片转换、音频转换等）都支持批量文件处理。</div>
      </div>
    </div>`
  },
  'faq-privacy': {
    title: '隐私与安全',
    html: `<div class="help-doc">
      <h2>常见问题 - 隐私与安全</h2>

      <div class="help-faq-item">
        <div class="help-faq-q">Q：我的文件安全吗？</div>
        <div class="help-faq-a">A：是的。所有文件处理（PDF、图片、音频、视频等）均在本地完成，不会上传到任何服务器。</div>
      </div>

      <div class="help-faq-item">
        <div class="help-faq-q">Q：AI 工具会保存我的数据吗？</div>
        <div class="help-faq-a">A：AI 工具（润色、翻译、对话等）会将文本内容发送到 AI 接口进行处理，但不会在本地保存您的输入内容。</div>
      </div>

      <div class="help-faq-item">
        <div class="help-faq-q">Q：PDF 加密安全吗？</div>
        <div class="help-faq-a">A：PDF 加密使用行业标准加密算法，安全性取决于密码强度。建议使用 8 位以上包含字母、数字、特殊字符的密码。</div>
      </div>

      <div class="help-faq-item">
        <div class="help-faq-q">Q：应用会收集使用数据吗？</div>
        <div class="help-faq-a">A：ToolKnit 不收集任何用户隐私数据，不包含追踪代码或分析工具。</div>
      </div>
    </div>`
  },
  'faq-update': {
    title: '更新问题',
    html: `<div class="help-doc">
      <h2>常见问题 - 更新</h2>

      <div class="help-faq-item">
        <div class="help-faq-q">Q：如何检查更新？</div>
        <div class="help-faq-a">A：进入设置页面，在"版本与更新"区域点击"检查更新"按钮。应用启动时也会自动检查。</div>
      </div>

      <div class="help-faq-item">
        <div class="help-faq-q">Q：更新下载很慢怎么办？</div>
        <div class="help-faq-a">A：应用会根据系统语言自动选择最优下载源。如果仍然很慢，请检查网络连接或尝试更换网络环境。</div>
      </div>

      <div class="help-faq-item">
        <div class="help-faq-q">Q：可以跳过强制更新吗？</div>
        <div class="help-faq-a">A：不可以。强制更新通常包含重要的安全修复或功能改进，必须更新后才能继续使用。</div>
      </div>

      <div class="help-faq-item">
        <div class="help-faq-q">Q：更新失败怎么办？</div>
        <div class="help-faq-a">A：请检查网络连接，关闭防火墙/杀毒软件后重试。如果问题持续，可以手动下载最新版安装包覆盖安装。</div>
      </div>

      <div class="help-faq-item">
        <div class="help-faq-q">Q：更新会丢失我的设置吗？</div>
        <div class="help-faq-a">A：不会。更新只替换应用程序文件，用户设置和数据不会受到影响。</div>
      </div>
    </div>`
  }
};

export function getHelpContent() {
  return getLang() === 'zh' ? HELP_CONTENT : HELP_CONTENT_EN;
}

export { HELP_CONTENT_EN };

export default HELP_CONTENT;
