import { 
  Client, 
  GatewayIntentBits, 
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle, 
  EmbedBuilder,
  ChannelType,
  PermissionFlagsBits
} from 'discord.js';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

client.once('ready', () => {
  console.log(`[しゅん＆ぺんぎんさばBot] ログイン完了: ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
  // 1. スラッシュコマンド受信処理
  if (interaction.isChatInputCommand()) {
    const { commandName } = interaction;

    // 98個目: チケットパネル
    if (commandName === 'ticket-panel') {
      const embed = new EmbedBuilder()
        .setTitle('🎫 お問い合わせ・サポート')
        .setDescription('下のボタンを押すと、運営スタッフ専用の個別チケットチャンネルを作成します。')
        .setColor(0x00AE8D);

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('create_ticket')
          .setLabel('チケットを発行')
          .setStyle(ButtonStyle.Primary)
          .setEmoji('🎫')
      );

      await interaction.reply({ embeds: [embed], components: [row] });
      return;
    }

    // 99個目: 認証パネル
    if (commandName === 'verify-panel') {
      const embed = new EmbedBuilder()
        .setTitle('✅ 認証パネル')
        .setDescription('ボタンを押してサーバー認証を完了してください。')
        .setColor(0x5865F2);

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('btn_verify')
          .setLabel('認証する')
          .setStyle(ButtonStyle.Success)
          .setEmoji('🔓')
      );

      await interaction.reply({ embeds: [embed], components: [row] });
      return;
    }

    // 各種コマンド応答分岐
    switch (commandName) {
      case 'shun':
        await interaction.reply('しゅん＆ぺんぎんさばへようこそ！🐧✨');
        break;
      case 'ping':
        await interaction.reply(`Pong! 🏓 応答速度: ${client.ws.ping}ms`);
        break;
      case 'verify':
        await interaction.reply({ content: '手動認証コマンドが実行されました。', ephemeral: true });
        break;
      default:
        await interaction.reply({ content: `コマンド「/${commandName}」を実行しました。`, ephemeral: true });
        break;
    }
  }

  // 2. ボタン操作処理 (認証・チケット作成)
  if (interaction.isButton()) {
    if (interaction.customId === 'btn_verify') {
      await interaction.reply({ content: '✅ 認証が完了しました！サーバーをお楽しみください。', ephemeral: true });
    }

    if (interaction.customId === 'create_ticket') {
      const channelName = `ticket-${interaction.user.username}`;
      const guild = interaction.guild;

      const ticketChannel = await guild.channels.create({
        name: channelName,
        type: ChannelType.GuildText,
        permissionOverwrites: [
          {
            id: guild.roles.everyone.id,
            deny: [PermissionFlagsBits.ViewChannel],
          },
          {
            id: interaction.user.id,
            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
          },
        ],
      });

      await interaction.reply({ content: `チケットチャンネルを作成しました: ${ticketChannel}`, ephemeral: true });
      await ticketChannel.send(`@here ${interaction.user} 様お問い合わせありがとうございます。サポートの対応をお待ちください。`);
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
