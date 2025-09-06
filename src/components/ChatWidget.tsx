import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMarketplaceStore } from '@/store/marketplace';
import { cn } from '@/lib/utils';

export function ChatWidget() {
  const { 
    chatMessages, 
    isChatOpen, 
    toggleChat, 
    addChatMessage 
  } = useMarketplaceStore();
  
  const [message, setMessage] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isChatOpen) {
      scrollToBottom();
    }
  }, [chatMessages, isChatOpen]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    addChatMessage(message);
    setMessage('');
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isChatOpen ? (
        <Button
          onClick={toggleChat}
          variant="hero"
          size="lg"
          className="rounded-full shadow-strong hover:shadow-strong hover:scale-110"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      ) : (
        <Card className={cn(
          "w-80 shadow-strong transition-smooth",
          isMinimized ? "h-14" : "h-96"
        )}>
          <CardHeader className="p-4 border-b bg-gradient-primary text-primary-foreground">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">
                Customer Support
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-primary-foreground hover:bg-primary-foreground/20"
                  onClick={() => setIsMinimized(!isMinimized)}
                >
                  <Minimize2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-primary-foreground hover:bg-primary-foreground/20"
                  onClick={toggleChat}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="text-xs text-primary-foreground/80">
              We're here to help with your selling questions!
            </p>
          </CardHeader>
          
          {!isMinimized && (
            <>
              <CardContent className="p-0 h-64 overflow-y-auto">
                <div className="p-4 space-y-3">
                  {chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={cn(
                        "flex",
                        msg.sender === 'user' ? "justify-end" : "justify-start"
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[80%] rounded-lg px-3 py-2 text-sm",
                          msg.sender === 'user'
                            ? "bg-primary text-primary-foreground"
                            : msg.sender === 'bot'
                            ? "bg-secondary text-secondary-foreground"
                            : "bg-accent text-accent-foreground"
                        )}
                      >
                        <p>{msg.message}</p>
                        <p className={cn(
                          "text-xs mt-1 opacity-70",
                          msg.sender === 'user' 
                            ? "text-primary-foreground/70" 
                            : "text-muted-foreground"
                        )}>
                          {formatTime(msg.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </CardContent>
              
              <div className="p-4 border-t">
                <form onSubmit={handleSendMessage} className="flex space-x-2">
                  <Input
                    placeholder="Ask about selling, pricing, categories..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" size="icon" variant="default">
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </>
          )}
        </Card>
      )}
    </div>
  );
}