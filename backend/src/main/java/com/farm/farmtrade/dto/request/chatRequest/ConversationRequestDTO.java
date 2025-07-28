package com.farm.farmtrade.dto.request.chatRequest;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConversationRequestDTO {
    @NotEmpty(message = "userIds cannot be empty")
    private List<Integer> userIds;

    private boolean isGroup;

   // @NotNull(message = "name cannot be null for group conversations")
    private String name;

    public List<Integer> getUserIds() {
        return userIds;
    }

    public void setUserIds(List<Integer> userIds) {
        this.userIds = userIds;
    }

    public boolean isGroup() {
        return isGroup;
    }

    public void setIsGroup(boolean isGroup) {
        this.isGroup = isGroup;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public static class ProductMessageRequest {
        private Integer senderId;
        private Integer productId;

        public Integer getSenderId() {
            return senderId;
        }

        public void setSenderId(Integer senderId) {
            this.senderId = senderId;
        }

        public Integer getProductId() {
            return productId;
        }

        public void setProductId(Integer productId) {
            this.productId = productId;
        }

        class ConversationRequest {
            private List<Integer> userIDs;
            private boolean isGroup;
            private String name;

            // Getters and setters
            public List<Integer> getUserIDs() {
                return userIDs;
            }

            public void setUserIDs(List<Integer> userIDs) {
                this.userIDs = userIDs;
            }

            public boolean isGroup() {
                return isGroup;
            }

            public void setGroup(boolean isGroup) {
                this.isGroup = isGroup;
            }

            public String getName() {
                return name;
            }

            public void setName(String name) {
                this.name = name;
            }
        }
    }
}